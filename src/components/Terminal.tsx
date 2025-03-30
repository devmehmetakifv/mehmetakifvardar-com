'use client';

import { useEffect, useState, useRef, KeyboardEvent, useMemo } from 'react';

const Terminal = () => {
  const [currentText, setCurrentText] = useState<Array<{ content: string; isResponse: boolean }>>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingCommand, setIsTypingCommand] = useState(false);
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const [isInitialDemo, setIsInitialDemo] = useState(true);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  // Removed showFlagCopy state as it wasn't used effectively
  // const [showFlagCopy, setShowFlagCopy] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // Changed pre to div for better layout control if needed
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Add references for the latest content (optional, keep if used elsewhere)
  // const latestContentRef = useRef<HTMLSpanElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const PROMPT = '┌──(mehmetakif㉿kali)-[~]\n└─$ ';
  const TYPING_SPEED_BASE = 50;
  const RESPONSE_TYPING_SPEED_BASE = 15;
  const RESPONSE_TYPING_SPEED_MIN = 4;
  const COMMAND_PAUSE = 300;
  const RESPONSE_PAUSE = 800;
  const TERMINAL_ANIMATION_DURATION = 2500;
  const FLAG_VALUE = "THM{M3HM3T_4K1F_V4RD4R}";

  const [flagInput, setFlagInput] = useState("");
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [flagError, setFlagError] = useState(false);
  //const [isCopied, setIsCopied] = useState(false);


  // Replace state with refs for scroll tracking
  const userScrolledRef = useRef(false);
  const isAtBottomRef = useRef(true);

  const playTypeSound = () => {
    if (audioRef.current) {
      const clone = audioRef.current.cloneNode() as HTMLAudioElement;
      clone.volume = 0.2;
      clone.play().catch(err => console.log('Audio play failed:', err));
      clone.addEventListener('ended', () => clone.remove());
    }
  };

  // --- COMMAND RESPONSES (Keep as is) ---
  const commandResponses = useMemo(() => ({
    'help': 'Available commands:\n\n# Commands About Me\n[+] whoami --> Find out who I am\n[+] whatdoido --> Find out what I do\n[+] education --> Find out about my education\n[+] toolsiknow --> List tools and technologies I know\n[+] expertise --> List my areas of expertise\n[+] experiences --> List my professional experiences\n\n# Miscellaneous Commands\n[+] ls --> List files in current directory\n[+] cat --> Cat?\n[+] clear --> Clear the terminal',
    'whoami': "I'm a third-year Software Engineering student focused on gaining expertise in cybersecurity, particularly in offensive security and penetration testing. I have a strong interest in web security, code vulnerabilities, and penetration testing, constantly developing my skills in these areas. My experience in backend web development with .NET Core technologies over the past few years has given me a developer's perspective in this field. I've gained practical experience in various security scenarios by ranking in the top 5% globally on the TryHackMe platform. I actively use cybersecurity tools to analyze and report real-world security vulnerabilities.",
    'whatdoido': 'I do cybersecurity research and penetration testing. I participate in bug bounty programs and CTF competitions. I also develop web applications, specifically in the .NET Core ecosystem.',
    'education': "I'm a 3rd year Software Engineering student at İstanbul Sağlık ve Teknoloji Üniversitesi. I'm a full scholarship recipient.",
    'expertise': "# Areas of Expertise\n[*] .NET Core\n[*] Web Application Security (OWASP Top 10)\n[*] Network Security & Penetration Testing (MITM, ARP Spoofing, WPA2 Cryptanalysis, IDS/OPS Evasion)\n[*] CTF & Red Teaming (Web Exploitation, OSINT, Privilege Escalation, Reverse Engineering)\n[*] Linux Systems\n[*] SQL Server Administration\n[*] Scripting & Automation (Python, Bash, API Pentesting)\n[*] Vulnerability Research (ExploitDB, SearchSploit)\n[*] Post-Exploitation (Reverse Shells, Bind Shells, Privilege Escalation, Persistence Techniques)",
    'toolsiknow': "# Web & API Pentesting\n[*] Burp Suite\n[*] cURL\n[*] Postman\n[*] Ffuf\n\n# Password Cracking & Brute Force\n[*] Hydra\n[*] John the Ripper\n[*] Hashcat\n[*] Crunch\n\n# Network Reconnaissance & Scanning\n[*] Nmap\n[*] Masscan\n[*] Wireshark\n\n# Vulnerability Assessment & Exploitation\n[*] SQLMap\n[*] Nikto\n[*] Metasploit\n[*] ExploitDB\n[*] SearchSploit\n\n# OSINT & Information Gathering\n[*] OSINT Framework\n[*] theHarvester\n[*] Sherlock\n\n# Wordlist & Directory Discovery\n[*] Gobuster\n[*] Dirb\n[*] Dirbuster\n\n# Shell Access & Privilege Escalation\n[*] LinPEAS\n[*] GTFOBins\n\n# Malware & Reverse Engineering\n[*] IDA Free\n[*] Strings\n[*] Binwalk\n[*] Steghide\n\n# Scripting & Automation\n[*] Python\n[*] Bash Scripting\n\n# Web Development & Database Management\n[*] .NET Core\n[*] Entity Framework\n[*] SQL Server\n[*] MySQL\n\n# Version Control & CI/CD\n[*] Git\n[*] GitHub Actions",
    'experiences': "# CYBERSECURITY EXPERIENCE\nTryHackMe.com – Top 5% (01/23 – Present)\nCTF Player\n[*] Actively participating on TryHackMe platform to enhance my knowledge and skills by solving machines with various security vulnerabilities.\n[*] Completed over 50 machines focusing on web security, vulnerability analysis, network security, and exploitation.\n\n# PROFESSIONAL EXPERIENCE\nNext4biz Information Technologies Inc. (06/24 – 07/24)\n.NET Core Developer Intern\n[*] Completed my first mandatory internship at Next4biz, working intensively with experienced mentors on SQL Server Administration and .NET Core development.\n[*] Developed a Student Information System platform from scratch, gaining experience in building a complete web application with all components.\n[*] Worked with modern technologies including SignalR, Hangfire, Microsoft Identity, and Entity Framework Core.\n\nISTUN Software Development Team (08/23 – Present)\nLead Software Developer\n[*] Active member of a 6-person software development team established under the leadership of Dr. Nazlı TOKATLI, head of the Computer Engineering department at the university.\n[*] Played a key role in developing and managing important projects.\n[*] Utilized technologies such as Git, .NET Core, and AI Fine Tuning during this experience.",
    'ls': "flag.txt",
    'cat': "Usage: cat [filename]",
    'cat flag.txt': FLAG_VALUE, // Use constant
    'clear': 'Clearing terminal...',
  }), [FLAG_VALUE]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTerminalReady(true);
    }, TERMINAL_ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [commandResponses]);

  useEffect(() => {
    audioRef.current = new Audio('/keyboard.mp3');
    audioRef.current.volume = 0.2;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [commandResponses]);

  const calculateTypingSpeed = (content: string, isCommand: boolean): number => {
    if (isCommand) {
      return TYPING_SPEED_BASE;
    } else {
      const length = content.length;
      if (length < 100) return RESPONSE_TYPING_SPEED_BASE;
      if (length < 500) return Math.max(RESPONSE_TYPING_SPEED_MIN + 10, RESPONSE_TYPING_SPEED_BASE - (length / 100));
      return RESPONSE_TYPING_SPEED_MIN;
    }
  };

  // --- SCROLLING LOGIC ---

  // Modify forceScrollToBottom to use scrollTop instead of scrollIntoView
  const forceScrollToBottom = () => {
    if (!userScrolledRef.current || isAtBottomRef.current) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      });
    }
  };

  // Update scroll event handler
  const handleScroll = (e: Event) => {
    const element = e.target as HTMLDivElement;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      isAtBottomRef.current = isBottom;
      if (!isBottom) {
        userScrolledRef.current = true;
      }
    }
  };

  // Set up MutationObserver for general content changes
  useEffect(() => {
    if (contentRef.current) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      observerRef.current = new MutationObserver(() => {
        // Only scroll if we're at the bottom or haven't scrolled up
        if (!userScrolledRef.current || isAtBottomRef.current) {
          forceScrollToBottom();
        }
      });
      observerRef.current.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    return () => observerRef.current?.disconnect();
  }, [commandResponses]); // Empty dependency array since we're using refs

  // Scroll when new text lines are added (but not during typing)
  useEffect(() => {
    if (!isTypingCommand && !isTypingResponse && (!userScrolledRef.current || isAtBottomRef.current)) {
      forceScrollToBottom();
    }
  }, [currentText, isTypingCommand, isTypingResponse]);

  // Scroll continuously during response typing
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;
    if (isTypingResponse && (!userScrolledRef.current || isAtBottomRef.current)) {
      scrollInterval = setInterval(() => {
        forceScrollToBottom();
      }, 100);
    }
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isTypingResponse]);

  // Scroll when user is typing the command
  useEffect(() => {
    if (isWaitingForInput && (!userScrolledRef.current || isAtBottomRef.current)) {
      forceScrollToBottom();
    }
  }, [userInput, isWaitingForInput]);

  // --- FOCUS LOGIC ---

  // Focus input when terminal is ready and waiting for input starts
  useEffect(() => {
    if (isTerminalReady && isWaitingForInput && inputRef.current) {
      // Use a small timeout to ensure focus happens after render and doesn't fight scroll
      const timer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        // Optionally force scroll again after focus, just in case
        forceScrollToBottom();
      }, 0); // 0ms timeout often works, maybe 50ms if issues persist
      return () => clearTimeout(timer);
    }
  }, [isTerminalReady, isWaitingForInput]);

  // --- INITIAL DEMO (Keep as is) ---
  useEffect(() => {
    const runInitialDemo = async () => {
      if (!isTerminalReady || !isInitialDemo) return;

      setIsTypingCommand(true);
      setCurrentCommand('');
      forceScrollToBottom(); // Ensure visible before starting

      await new Promise(resolve => setTimeout(resolve, COMMAND_PAUSE));

      const helpCommand = 'help';
      const commandSpeed = calculateTypingSpeed(helpCommand, true);
      for (let i = 0; i <= helpCommand.length; i++) {
        setCurrentCommand(helpCommand.slice(0, i));
        playTypeSound();
        // Don't force scroll on every char here, rely on observer/userInput effect
        await new Promise(resolve => setTimeout(resolve, commandSpeed));
      }
      forceScrollToBottom(); // Scroll after command typed

      await new Promise(resolve => setTimeout(resolve, RESPONSE_PAUSE));

      setCurrentText(prev => [...prev, { content: `<span class="terminal-prompt">${PROMPT}</span><span class="terminal-command" style="color: #ffffff; font-weight: bold;">${helpCommand}</span>\n`, isResponse: false }]);
      setCurrentCommand('');
      setIsTypingCommand(false);
      setIsTypingResponse(true);
      setCurrentResponse(''); // Clear response before typing starts
      forceScrollToBottom(); // Scroll before response starts

      await new Promise(resolve => setTimeout(resolve, 50));

      const helpResponse = commandResponses['help'];
      const responseSpeed = calculateTypingSpeed(helpResponse, false);

      for (let i = 0; i <= helpResponse.length; i++) {
        setCurrentResponse(helpResponse.slice(0, i));
        if (helpResponse[i - 1] !== '\n' && helpResponse[i - 1] !== ' ') playTypeSound();
        // Rely on the isTypingResponse effect + MutationObserver for scrolling here
        await new Promise(resolve => setTimeout(resolve, responseSpeed));
      }
       forceScrollToBottom(); // Ensure scroll after response finishes

      setCurrentText(prev => [...prev, { content: `<span style="color: #ffffff;">${helpResponse}</span>\n\n`, isResponse: true }]);
      setCurrentResponse('');
      setIsTypingResponse(false);
      setIsInitialDemo(false);
      setIsWaitingForInput(true); // This will trigger focus and scroll via useEffect
    };

    runInitialDemo();
  }, [isTerminalReady, isInitialDemo, commandResponses]); // Dependencies seem correct

  // --- COMMAND PROCESSING ---
  const processCommand = async (command: string) => {
      const trimmedCommand = command.trim();
      if (!trimmedCommand) {
          // If user just presses enter, add a new prompt line
          setCurrentText(prev => [...prev, { content: `<span class="terminal-prompt">${PROMPT}</span><span class="terminal-command"></span>\n`, isResponse: false }]);
          setUserInput(''); // Clear input
          setIsWaitingForInput(true); // Ready for next input immediately
          return;
      }

      setIsWaitingForInput(false);

      // Add command to history FIRST
      setCurrentText(prev => [...prev, { content: `<span class="terminal-prompt">${PROMPT}</span><span class="terminal-command" style="color: #ffffff; font-weight: bold;">${trimmedCommand}</span>\n`, isResponse: false }]);
      setUserInput(''); // Clear the visible input line now
      forceScrollToBottom(); // Ensure command line is visible

      // Handle 'clear' command
      if (trimmedCommand === 'clear') {
          setIsTypingResponse(true); // Show clearing message
          setCurrentResponse(commandResponses['clear']);
          forceScrollToBottom();
          await new Promise(resolve => setTimeout(resolve, 500));

          setCurrentText([]); // Clear history
          setCurrentResponse(''); // Clear message
          setIsTypingResponse(false);
          setIsWaitingForInput(true); // Ready for input
          // Focus will be handled by the isWaitingForInput useEffect
          return;
      }

      let response = '';
      let isFlagCommand = false;

      // Handle 'cat' command variants
      if (trimmedCommand.startsWith('cat ')) {
          const fileName = trimmedCommand.substring(4).trim();
          if (fileName === 'flag.txt') {
              response = commandResponses['cat flag.txt'];
              isFlagCommand = true;
          } else if (fileName === '') {
              response = commandResponses['cat']; // Show usage
          } else {
              response = `cat: ${fileName}: No such file or directory`;
          }
      } else {
          response = (commandResponses as Record<string, string>)[trimmedCommand] || `Command not found: ${trimmedCommand}`;
      }

      // --- Type out the response ---
      setIsTypingResponse(true);
      setCurrentResponse(''); // Clear before typing
      forceScrollToBottom(); // Ensure space is visible
      await new Promise(resolve => setTimeout(resolve, 50)); // Small pause

      const responseSpeed = calculateTypingSpeed(response, false);
      for (let i = 0; i <= response.length; i++) {
          setCurrentResponse(response.slice(0, i));
          // Play sound less frequently for fast typing or spaces/newlines
          if (responseSpeed > 30 && response[i - 1] !== '\n' && response[i - 1] !== ' ') playTypeSound();
          else if (i % 3 === 0 && response[i - 1] !== '\n' && response[i - 1] !== ' ') playTypeSound(); // Slower sound for fast typing
          // Scrolling handled by isTypingResponse effect + observer
          await new Promise(resolve => setTimeout(resolve, responseSpeed));
      }
      forceScrollToBottom(); // Ensure final scroll

      // Add the completed response to history
      if (isFlagCommand) {
          // Add special formatting for the flag
           setCurrentText(prev => [
              ...prev,
              { content: `<span class="flag-highlight">${FLAG_VALUE}</span> <button class="inline-copy-btn" onclick="navigator.clipboard.writeText('${FLAG_VALUE}'); this.textContent = 'Copied! ✓'; setTimeout(() => this.textContent = 'Copy Flag 📋', 2000);">Copy Flag 📋</button>\n\n`, isResponse: true }
          ]);
      } else {
          // Add normal response with consistent white color
          setCurrentText(prev => [...prev, { content: `<span style="color: #ffffff;">${response}</span>\n\n`, isResponse: true }]);
      }

      setCurrentResponse(''); // Clear the currently typing response line
      setIsTypingResponse(false);
      setIsWaitingForInput(true); // Ready for next command
      // Focus/scroll handled by useEffects based on isWaitingForInput
  };


  // --- INPUT HANDLERS ---

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTypingCommand && !isTypingResponse) {
      e.preventDefault(); // Prevent potential form submission if wrapped
      processCommand(userInput);
    }
    // No need to manually handle scroll here anymore
  };

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, [commandResponses]);

  // Handle container click to focus input
  const handleContainerClick = () => {
    if (inputRef.current && isWaitingForInput) {
        inputRef.current.focus({ preventScroll: true });
    }
  };

  // --- FLAG SUBMISSION & COPY (Mostly unchanged, added button text update) ---
  const checkFlag = () => {
    if (flagInput.trim() === FLAG_VALUE) {
      setFlagError(false);
      setFlagSubmitted(true);
      setCurrentText(prev => [
        ...prev,
        { content: `<span class="terminal-prompt">${PROMPT}</span><span class="terminal-command" style="color: #ffffff; font-weight: bold;">flag_verify "${flagInput}"</span>\n`, isResponse: false },
        { content: '<span style="color: #00ff00; font-weight: bold;">✓ Flag verified successfully! Challenge completed!</span>\n\n', isResponse: true }
      ]);
       forceScrollToBottom(); // Scroll after adding success message
    } else {
      setFlagError(true);
    }
  };

  //const copyFlagToClipboard = (buttonElement?: HTMLElement | null) => {
  //  navigator.clipboard.writeText(FLAG_VALUE).then(() => {
  //    if (buttonElement) {
  //      const originalText = buttonElement.textContent;
  //      buttonElement.textContent = 'Copied! ✓';
  //      setTimeout(() => {
  //        buttonElement.textContent = originalText; // Restore original text
  //      }, 2000);
  //    } else {
  //      // Fallback for potential direct calls without button context
  //      setIsCopied(true);
  //      setTimeout(() => setIsCopied(false), 2000);
  //    }
  //  }).catch(err => {
  //    console.error('Could not copy text: ', err);
  //  });
  //};

  // Add scroll event listener
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.addEventListener('scroll', handleScroll);
      return () => {
        contentRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [commandResponses]); // Empty dependency array since we're using refs

  // Reset userScrolled when user manually scrolls to bottom
  useEffect(() => {
    if (isAtBottomRef.current) {
      userScrolledRef.current = false;
    }
  }, [commandResponses]);

  return (
    <>
      <div className="terminal-container">
        {/* Header remains the same */}
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control close"></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <div className="terminal-title">mehmetakif@kali: ~</div>
        </div>
        {/* Use a div for content area to contain the pre and the anchor */}
        <div
          className="terminal-content-area" // New wrapper class
          style={{
            height: 'calc(100% - 40px)', // Height of container minus header
            overflowY: 'auto',          // Make this the scrollable element
            position: 'relative',       // Needed for absolute positioned input
          }}
          onClick={handleContainerClick} // Click focuses input
          ref={contentRef} // Ref on the scrollable container
        >
          <pre
            className="terminal-text" // Keep pre for formatting
            style={{
              // Remove height/overflow from pre, let wrapper handle scroll
              width: '100%',
              margin: 0,      // Reset default pre margin
              padding: '5px 10px', // Add padding inside the scroll area
              boxSizing: 'border-box',
              minHeight: '100%' // Ensure it tries to fill the container
            }}
          >
            {currentText.map((text, index) => (
              <span
                key={index}
                className={text.isResponse ? 'terminal-response' : ''}
                dangerouslySetInnerHTML={{ __html: text.content }}
                // Removed latestContentRef here, scrollAnchorRef is more reliable
              />
            ))}
            {/* Display currently typing command */}
            {isTypingCommand && (
              <span>
                <span className="terminal-prompt" dangerouslySetInnerHTML={{__html: PROMPT}}/>
                <span className="terminal-command" style={{ color: '#ffffff', fontWeight: 'bold' }}>{currentCommand}</span>
                {showCursor && <span className="cursor">█</span>}
              </span>
            )}
            {/* Display currently typing response */}
            {isTypingResponse && currentResponse && (
              <span className="terminal-response" style={{ color: '#ffffff' }}>
                {currentResponse}
                {showCursor && <span className="cursor">█</span>}
              </span>
            )}
            {/* Display prompt and user input when waiting */}
            {isWaitingForInput && (
              <span>
                <span className="terminal-prompt" dangerouslySetInnerHTML={{__html: PROMPT}}/>
                <span className="terminal-command" style={{ color: '#ffffff', fontWeight: 'bold' }}>{userInput}</span>
                {showCursor && <span className="cursor">█</span>}
              </span>
            )}
            {/* Scroll Anchor: Always at the very end */}
            <div
              ref={scrollAnchorRef}
              style={{ height: '1px', width: '1px', opacity: 0 }} // Small, invisible anchor
            />
          </pre>
        </div> {/* End terminal-content-area */}

        {/* Hidden input, positioned absolutely relative to terminal-content-area */}
        <input
          ref={inputRef}
          type="text"
          className="terminal-input" // Keep for potential styling (though hidden)
          value={userInput}
          onChange={(e) => {
            // *** FIX: Removed manual scroll restoration ***
            setUserInput(e.target.value);
            if (flagError) setFlagError(false);
          }}
          onKeyDown={handleKeyDown} // Keep keydown handler
          aria-label="Terminal input"
          style={{
            position: 'absolute', // Position relative to parent
            left: '-9999px',       // Hide off-screen
            top: '0',             // Position doesn't really matter
            width: '1px',         // Minimal size
            height: '1px',
            opacity: 0,
            border: 'none',
            padding: 0,
          }}
          // Auto-attributes for accessibility/mobile often useful
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div> {/* End terminal-container */}

      {/* Social Buttons and Flag Submission remain the same */}
      <div className="social-buttons-container">
         {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/mehmet-akif-vardar/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button linkedin"
        >
          <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>LinkedIn</span>
        </a>
         {/* TryHackMe */}
        <a
          href="https://tryhackme.com/p/m4k"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button tryhackme"
        >
           <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor"> {/* Corrected viewBox */}
             <path d="M19.875 6.125c-1.36-1.33-3.143-2.171-5.076-2.329C14.143 2.77 13.1 2 12 2s-2.143.77-2.799 1.796C7.267 4.054 5.484 4.9 4.125 6.25c-2.5 2.448-2.5 6.427 0 8.875 1.36 1.33 3.143 2.171 5.076 2.329C9.857 18.48 10.9 19.25 12 19.25s2.143-.77 2.799-1.796c1.933-.158 3.716-.999 5.076-2.329 2.5-2.448 2.5-6.427 0-8.75zm-1.06 7.815c-1.062 1.037-2.45 1.69-3.94 1.82-.503.863-1.337 1.44-2.25 1.44s-1.747-.577-2.25-1.44c-1.49-.13-2.878-.783-3.94-1.82-1.75-1.707-1.75-4.473 0-6.18 1.062-1.037 2.45-1.69 3.94-1.82.503-.863 1.337-1.44 2.25-1.44s1.747.577 2.25 1.44c1.49.13 2.878.783 3.94 1.82 1.75 1.707 1.75 4.473 0 6.18zM10.78 9.345l-2.06 3.568 2.06 3.567h2.44l2.06-3.567-2.06-3.568h-2.44z"/> {/* Simple THM-like shape */}
          </svg>
          <span>TryHackMe</span>
        </a>
         {/* GitHub */}
        <a
          href="https://github.com/devmehmetakifv"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button github"
        >
          <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </div>

      <div className="flag-submission-container">
        <div className="flag-input-wrapper">
          <input
            type="text"
            value={flagInput}
            onChange={(e) => {
              setFlagInput(e.target.value);
              setFlagError(false);
            }}
            placeholder="Did you find the flag?"
            className={`flag-input ${flagSubmitted ? 'flag-input-success' : ''} ${flagError ? 'flag-input-error' : ''}`}
            disabled={flagSubmitted}
          />
          {flagError && <div className="flag-error-message">Incorrect flag. Try again!</div>}
        </div>
        <button
          onClick={checkFlag}
          className={`flag-submit-button ${flagSubmitted ? 'flag-submit-success' : ''}`}
          disabled={flagSubmitted}
        >
          <svg className="paper-plane-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      {/* Global styles remain the same */}
      <style jsx global>{`
        /* Base Terminal Styles (Keep existing) */
        .terminal-container { /* ... */ }
        .terminal-header { /* ... */ }
        .terminal-controls { /* ... */ }
        .terminal-title { /* ... */ }
        /* ... other existing styles ... */

        /* Style the new content area */
        .terminal-content-area {
           font-family: 'Courier New', Courier, monospace; /* Or your preferred mono font */
           background-color: #282c34; /* Example background */
           color: #abb2bf; /* Example text color */
           line-height: 1.4;
           font-size: 1em; /* Adjust as needed */
           white-space: pre-wrap; /* Important for line breaks */
           word-wrap: break-word; /* Break long lines */
        }

        /* Ensure pre inside takes up space but doesn't scroll */
        .terminal-content-area pre.terminal-text {
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: visible; /* Let the parent handle scroll */
          margin: 0;
          padding: 10px; /* Padding inside the scrollable area */
          min-height: 100%; /* Try to fill vertical space */
        }


        .terminal-prompt {
          color: #61afef; /* Example prompt color */
          user-select: none; /* Prevent selecting prompt */
        }
        .terminal-command {
          color: #e5c07b; /* Example command color */
        }
        .terminal-response {
          color: #abb2bf; /* Example default response color */
          display: inline-block; /* Prevents collapsing whitespace sometimes */
          width: 100%; /* Ensure response takes full width */
        }
        .cursor {
          background-color: #ffffff !important; /* Force white color */
          display: inline-block;
          width: 0.6em;
          vertical-align: baseline;
        }

        /* Flag and Copy Button styles (Keep existing) */
        .flag-highlight {
          background-color: rgba(40, 167, 69, 0.2);
          padding: 2px 6px;
          border-radius: 3px;
          color: #00ff00;
          font-weight: bold;
        }
        .inline-copy-btn {
          background-color: #282c34;
          color: #00a8ff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 2px 8px;
          margin-left: 10px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9em;
          display: inline-block;
          vertical-align: middle;
          transition: all 0.2s ease;
        }
        .inline-copy-btn:hover {
          background-color: #333842;
          border-color: #666;
        }
        .inline-copy-btn:active {
          transform: scale(0.98);
        }

        /* Social and Flag Submission Styles (Keep existing) */
         .social-buttons-container { /* ... */ }
         .social-button { /* ... */ }
         .social-icon { /* ... */ }
         .flag-submission-container { /* ... */ }
         .flag-input-wrapper { /* ... */ }
         .flag-input { /* ... */ }
         .flag-error-message { /* ... */ }
         .flag-submit-button { /* ... */ }
         .paper-plane-icon { /* ... */ }

      `}</style>
    </>
  );
};

export default Terminal;