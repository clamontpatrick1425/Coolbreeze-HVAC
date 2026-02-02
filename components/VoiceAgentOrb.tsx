
import React, { useState, useRef } from 'react';
import { Blob, LiveServerMessage } from '@google/genai';
import { startClaireVoiceSession } from '../services/geminiService';
import { MicrophoneIcon, XMarkIcon } from './icons';

// Audio Encoding/Decoding Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer | null> {
  try {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  } catch (e) {
    console.error("decodeAudioData error:", e);
    return null;
  }
}

type AgentStatus = 'idle' | 'listening' | 'speaking' | 'thinking' | 'error';

export const VoiceAgentOrb: React.FC = () => {
    const [status, setStatus] = useState<AgentStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // High-performance audio scheduling refs
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const isSessionActiveRef = useRef(false);

    const startSession = async () => {
        setError(null);
        setStatus('thinking');
        isSessionActiveRef.current = true;
        nextStartTimeRef.current = 0;

        try {
            // Trigger microphone request and session connection in parallel for faster initiation
            const streamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
            
            const sessionResult = startClaireVoiceSession({
                onopen: () => {
                    if (!isSessionActiveRef.current) return;
                    console.log('Voice Session Handshake Complete.');
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (!isSessionActiveRef.current) return;
                    
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    const ctx = outputAudioContextRef.current;

                    if (base64Audio && ctx && ctx.state !== 'closed') {
                        const audioBuffer = await decodeAudioData(
                            decode(base64Audio),
                            ctx,
                            24000,
                            1,
                        );

                        if (audioBuffer && isSessionActiveRef.current) {
                            setStatus('speaking');
                            
                            // Cursor Scheduling logic for gapless playback
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            
                            source.onended = () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0 && isSessionActiveRef.current) {
                                    setStatus('listening');
                                }
                            };

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                    }

                    const interrupted = message.serverContent?.interrupted;
                    if (interrupted && isSessionActiveRef.current) {
                        for (const source of sourcesRef.current.values()) {
                            try { source.stop(); } catch(e) {}
                        }
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                        setStatus('listening');
                    }
                },
                onerror: (e: any) => {
                    console.error('Claire session error:', e);
                    if (isSessionActiveRef.current) {
                      setError("Sorry, there was a connection error.");
                      setStatus('error');
                      closeSession();
                    }
                },
                onclose: (e: any) => {
                    if (isSessionActiveRef.current) {
                      closeSession();
                    }
                },
            });

            if (typeof sessionResult !== 'object' || 'error' in sessionResult) {
                throw new Error((sessionResult as any).error || "Failed to start session");
            }
            sessionPromiseRef.current = sessionResult;

            // Resolve hardware stream and contexts
            const stream = await streamPromise;
            mediaStreamRef.current = stream;
            
            const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            await inCtx.resume();
            await outCtx.resume();
            
            inputAudioContextRef.current = inCtx;
            outputAudioContextRef.current = outCtx;

            // Connect microphone to model once session and stream are both ready
            sessionResult.then((session: any) => {
                if (!isSessionActiveRef.current || !inCtx || inCtx.state === 'closed') return;
                
                const source = inCtx.createMediaStreamSource(stream);
                mediaStreamSourceRef.current = source;
                
                const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
                scriptProcessorRef.current = scriptProcessor;

                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const int16 = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        int16[i] = inputData[i] * 32768;
                    }
                    const pcmBlob: Blob = {
                        data: encode(new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength)),
                        mimeType: 'audio/pcm;rate=16000',
                    };
                    session.sendRealtimeInput({ media: pcmBlob });
                };
                source.connect(scriptProcessor);
                scriptProcessor.connect(inCtx.destination);
                
                // If the model hasn't started speaking yet, show listening state
                if (status === 'thinking') setStatus('listening');
            }).catch(() => {});

        } catch (err: any) {
            console.error('Failed to start voice agent:', err);
            isSessionActiveRef.current = false;
            setError(err.message || "Could not access microphone.");
            setStatus('error');
        }
    };

    const closeSession = () => {
        isSessionActiveRef.current = false;
        
        const sessionPromise = sessionPromiseRef.current;
        sessionPromiseRef.current = null;
        if (sessionPromise) {
          sessionPromise.then(session => {
              try { session.close(); } catch(e) {}
          }).catch(() => {});
        }
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        if (scriptProcessorRef.current) {
            try { scriptProcessorRef.current.disconnect(); } catch(e) {}
            scriptProcessorRef.current = null;
        }

        if (mediaStreamSourceRef.current) {
            try { mediaStreamSourceRef.current.disconnect(); } catch(e) {}
            mediaStreamSourceRef.current = null;
        }
        
        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close().catch(() => {});
            inputAudioContextRef.current = null;
        }

        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close().catch(() => {});
            outputAudioContextRef.current = null;
        }

        for (const source of sourcesRef.current.values()) {
            try { source.stop(); } catch(e) {}
        }
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        
        setStatus(prev => (prev === 'error' ? 'error' : 'idle'));
    };

    const handleOrbClick = () => {
        if (status === 'idle' || status === 'error') {
            startSession();
        } else {
            closeSession();
        }
    };
    
    const getStatusClasses = () => {
        switch(status) {
            case 'listening': return 'border-green-400 animate-pulse';
            case 'speaking': return 'border-blue-400 scale-110 shadow-[0_0_40px_rgba(59,130,246,0.6)]';
            case 'thinking': return 'border-purple-400 animate-spin';
            case 'error': return 'border-red-500';
            case 'idle':
            default: return 'border-blue-800 hover:border-blue-600';
        }
    }

    return (
        <div className="relative group flex flex-col items-center">
            <button
                onClick={handleOrbClick}
                className={`w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 transition-all duration-500 ${getStatusClasses()}`}
                aria-label="Toggle AI Voice Agent Claire"
            >
               {status === 'idle' || status === 'error' ? (
                    <MicrophoneIcon className="w-24 h-24 text-blue-800" />
               ) : status === 'thinking' ? (
                    <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
               ) : (
                    <XMarkIcon className="w-24 h-24 text-red-500" />
               )}
            </button>
            
            <div className="mt-6 text-center">
                <p className={`text-xl font-black uppercase tracking-widest ${status === 'error' ? 'text-red-500' : 'text-blue-200'}`}>
                    {status === 'idle' ? "Click to talk to Claire" : 
                     status === 'listening' ? "Claire is listening..." : 
                     status === 'speaking' ? "Claire is speaking" : 
                     status === 'thinking' ? "Connecting..." : "Connection Error"}
                </p>
            </div>

            {status === 'speaking' && (
                <div className="absolute top-0 w-48 h-48 border-4 border-blue-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
            )}
        </div>
    );
};
