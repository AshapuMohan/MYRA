import { useState, useEffect, useRef, useCallback } from "react";

export function useVoiceControl({
  user,
  isVoiceEnabled,
  language,
  voice_speed,
  onCommand,
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognitionError, setRecognitionError] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const speak = useCallback(
    (text) => {
      if (synthRef.current && text) {
        synthRef.current.cancel(); 

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = voice_speed;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
      }
    },
    [language, voice_speed],
  );

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (typeof window !== "undefined") {
      if ("webkitSpeechRecognition" in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognitionRef.current = recognition;
      }
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis;
      }
    }
    return () => {
        isMountedRef.current = false;
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        recognitionRef.current?.stop();
    }
  }, []);

  useEffect(() => {
    if(!recognitionRef.current) return;
    
    recognitionRef.current.lang = language;
    recognitionRef.current.onstart = () => {
        if(!isMountedRef.current) return;
        setIsListening(true);
        setRecognitionError(null);
    };

    recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript && isMountedRef.current) {
            setTranscript(finalTranscript);
            onCommand(finalTranscript.toLowerCase().trim());
        }
    };

    recognitionRef.current.onerror = (event) => {
        if(!isMountedRef.current) return;
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setRecognitionError(event.error);

        if ( event.error !== "aborted" && event.error !== "not-allowed" && isVoiceEnabled && user ) {
            if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => recognitionRef.current?.start(), 1000);
        }
    };

    recognitionRef.current.onend = () => {
        if(!isMountedRef.current) return;
        setIsListening(false);
        if (isVoiceEnabled && user && !recognitionError) {
            if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => recognitionRef.current?.start(), 500);
        }
    };
  }, [language, isVoiceEnabled, user, recognitionError, onCommand]);

  useEffect(() => {
    const wasListening = isListening;
    if (user && isVoiceEnabled && recognitionRef.current && !isListening) {
        try {
            recognitionRef.current.start();
            if (!wasListening) {
                speak("Voice assistant activated. I am now listening for your commands.");
            }
        } catch (err) {
            // Avoid errors when start() is called while already starting
            if(err.name !== 'InvalidStateError') {
              console.error("Failed to start voice recognition:", err);
            }
        }
    } else if ((!user || !isVoiceEnabled) && recognitionRef.current && isListening) {
        recognitionRef.current.stop();
    }
  }, [user, isVoiceEnabled, isListening, speak]);

  return { isListening, isSpeaking, transcript, speak, stopSpeaking };
}
