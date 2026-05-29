export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Lab {
  title: string;
  description: string;
  steps: string[];
}

export interface Module {
  id: string;
  code: string; // e.g. "1.1"
  title: string;
  summary: string;
  topics: string[];
  lab?: Lab;
}

export interface Phase {
  id: string;
  num: number;
  code: string; // "Phase 01"
  title: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  accent: "offense" | "defense" | "ai" | "cloud" | "foundation";
  modules: Module[];
}

export const phases: Phase[] = [
  {
    id: "foundations",
    num: 1,
    code: "Phase 01",
    title: "Networking & Linux Foundations",
    tagline: "Master the terrain before the battle.",
    description:
      "Every defender starts here. Build fluency with the Linux command line, TCP/IP, and the protocols attackers abuse every day.",
    difficulty: "Beginner",
    accent: "foundation",
    modules: [
      {
        id: "f-1",
        code: "1.1",
        title: "Linux Command Line Mastery",
        summary: "Navigate, automate, and weaponize the shell.",
        topics: ["Filesystem & permissions", "Pipes & redirection", "Bash scripting", "Process & service control", "User & group management"],
        lab: {
          title: "Shell Survival Lab",
          description: "Recover a 'compromised' server using only the terminal.",
          steps: [
            "Locate hidden files dropped in /tmp and /var/www",
            "Inspect running processes and kill the rogue listener",
            "Read auth logs to find the attacker's source IP",
            "Write a one-line bash script to lock the offending account",
          ],
        },
      },
      {
        id: "f-2",
        code: "1.2",
        title: "TCP/IP & Network Protocols",
        summary: "How packets move — and how they leak.",
        topics: ["OSI & TCP/IP models", "DNS, DHCP, ARP", "Subnetting", "Routing & switching", "Wireshark fundamentals"],
        lab: {
          title: "Packet Detective",
          description: "Analyze a real capture to reconstruct an intrusion.",
          steps: [
            "Open the provided PCAP and filter for DNS traffic",
            "Identify the beaconing interval of the C2 channel",
            "Extract exfiltrated data from the HTTP stream",
            "Document the full attack timeline",
          ],
        },
      },
      {
        id: "f-3",
        code: "1.3",
        title: "System Hardening Basics",
        summary: "Reduce the attack surface from day one.",
        topics: ["Firewall (iptables/ufw)", "SSH hardening", "Patch management", "Service minimization", "File integrity monitoring"],
      },
    ],
  },
  {
    id: "offense-fundamentals",
    num: 2,
    code: "Phase 02",
    title: "Offensive Security Fundamentals",
    tagline: "Think like the adversary.",
    description:
      "Recon, scanning, exploitation, and post-exploitation. Learn the attacker kill chain through hands-on hacking.",
    difficulty: "Intermediate",
    accent: "offense",
    modules: [
      {
        id: "o-1",
        code: "2.1",
        title: "Reconnaissance & OSINT",
        summary: "The map before the mission.",
        topics: ["Passive vs active recon", "OSINT frameworks", "Subdomain enumeration", "Google dorking", "Metadata analysis"],
        lab: {
          title: "Footprint a Target",
          description: "Build a full profile of a fictional org from public data.",
          steps: [
            "Enumerate subdomains with amass",
            "Harvest employee emails and infer naming conventions",
            "Map exposed services with Shodan-style queries",
            "Produce a recon report with attack surface findings",
          ],
        },
      },
      {
        id: "o-2",
        code: "2.2",
        title: "Scanning & Enumeration",
        summary: "Find the doors, then find the locks.",
        topics: ["Nmap deep dive", "Service & version detection", "Vulnerability scanning", "SMB & SNMP enumeration", "Banner grabbing"],
        lab: {
          title: "Nmap Range",
          description: "Enumerate a vulnerable network segment.",
          steps: [
            "Run a staged Nmap scan against the lab subnet",
            "Identify the OS and open service versions",
            "Cross-reference versions with known CVEs",
            "Prioritize hosts by exploitability",
          ],
        },
      },
      {
        id: "o-3",
        code: "2.3",
        title: "Exploitation & Privilege Escalation",
        summary: "From foothold to full control.",
        topics: ["Metasploit fundamentals", "Manual exploitation", "Linux privesc", "Windows privesc", "Pivoting"],
        lab: {
          title: "Capture the Root",
          description: "Compromise a vulnerable box end-to-end.",
          steps: [
            "Exploit the exposed service for an initial shell",
            "Enumerate the host for privesc vectors",
            "Escalate to root using a misconfigured SUID binary",
            "Establish persistence and grab the flag",
          ],
        },
      },
    ],
  },
  {
    id: "crypto",
    num: 3,
    code: "Phase 03",
    title: "Applied Cryptography",
    tagline: "Where math meets exploitation.",
    description:
      "Attack-centric cryptography. Don't just memorize AES and RSA — learn exactly where and why implementations break.",
    difficulty: "Intermediate",
    accent: "foundation",
    modules: [
      {
        id: "c-1",
        code: "3.1",
        title: "Symmetric Encryption & Its Failures",
        summary: "AES is strong. The way people use it isn't.",
        topics: ["AES & modes of operation", "CBC vs GCM", "Padding oracle attacks", "ECB pattern leakage", "IV reuse attacks"],
        lab: {
          title: "Break the Cipher",
          description: "Exploit a padding oracle to decrypt without the key.",
          steps: [
            "Identify the CBC padding oracle in the web app",
            "Use the oracle to recover one block of plaintext",
            "Automate full-message decryption",
            "Demonstrate ECB image pattern leakage",
          ],
        },
      },
      {
        id: "c-2",
        code: "3.2",
        title: "TLS, PKI & HTTPS Attacks",
        summary: "The handshake everyone trusts.",
        topics: ["TLS handshake", "Certificates & PKI", "BEAST & POODLE", "Heartbleed", "SSL stripping"],
        lab: {
          title: "TLS Downgrade Lab",
          description: "Simulate a protocol downgrade on a test server.",
          steps: [
            "Inspect the server's supported cipher suites",
            "Force a downgrade to a vulnerable protocol",
            "Capture and analyze the weakened handshake",
            "Recommend a hardened TLS configuration",
          ],
        },
      },
      {
        id: "c-3",
        code: "3.3",
        title: "Hashing & Public-Key Attacks",
        summary: "Passwords, signatures, and key reuse.",
        topics: ["Hashing & salting", "Key derivation", "Rainbow tables", "Credential stuffing & spraying", "RSA padding flaws"],
        lab: {
          title: "Crack the Vault",
          description: "Recover credentials from a leaked hash dump.",
          steps: [
            "Identify the hashing algorithm and detect missing salts",
            "Run a dictionary + rule attack with hashcat",
            "Demonstrate why salted hashes resist rainbow tables",
            "Propose a modern KDF migration plan",
          ],
        },
      },
    ],
  },
  {
    id: "web",
    num: 4,
    code: "Phase 04",
    title: "Web Application Security",
    tagline: "The internet's biggest attack surface.",
    description:
      "OWASP Top 10 and beyond. Find, exploit, and remediate the vulnerabilities that power most breaches today.",
    difficulty: "Intermediate",
    accent: "offense",
    modules: [
      {
        id: "w-1",
        code: "4.1",
        title: "OWASP Top 10 Deep Dive",
        summary: "The classics, weaponized.",
        topics: ["Injection (SQLi, NoSQLi)", "Broken access control", "XSS variants", "SSRF", "Insecure deserialization"],
        lab: {
          title: "Hack the Shop",
          description: "Exploit a deliberately vulnerable e-commerce app.",
          steps: [
            "Bypass login with a SQL injection payload",
            "Escalate privileges via broken access control",
            "Steal an admin session with stored XSS",
            "Chain an SSRF to reach the internal metadata service",
          ],
        },
      },
      {
        id: "w-2",
        code: "4.2",
        title: "API & Authentication Attacks",
        summary: "Where modern apps actually live.",
        topics: ["REST & GraphQL abuse", "JWT attacks", "OAuth misconfig", "Rate-limit bypass", "Mass assignment"],
        lab: {
          title: "Token Forgery",
          description: "Defeat a JWT-based auth system.",
          steps: [
            "Decode the JWT and identify the signing algorithm",
            "Exploit an 'alg: none' misconfiguration",
            "Forge an admin token and access protected routes",
            "Recommend secure JWT validation",
          ],
        },
      },
    ],
  },
  {
    id: "cloud",
    num: 5,
    code: "Phase 05",
    title: "Cloud & Container Security",
    tagline: "Securing ephemeral infrastructure.",
    description:
      "2025+ cloud realities: multi-cloud IAM, Docker, Kubernetes, CI/CD, and serverless — both attack and defense.",
    difficulty: "Advanced",
    accent: "cloud",
    modules: [
      {
        id: "cl-1",
        code: "5.1",
        title: "Cloud Identity & Access Security",
        summary: "Identity is the new perimeter.",
        topics: ["AWS / Azure / GCP basics", "IAM privilege escalation", "Federated identity abuse", "STS token theft", "Secrets exposure"],
        lab: {
          title: "Escalate in the Cloud",
          description: "Pivot through misconfigured IAM roles.",
          steps: [
            "Enumerate permissions of a leaked access key",
            "Identify an over-permissive role chain",
            "Assume a privileged role via STS",
            "Access the protected S3 bucket and report the path",
          ],
        },
      },
      {
        id: "cl-2",
        code: "5.2",
        title: "Container & Kubernetes Security",
        summary: "Breaking out of the box.",
        topics: ["Docker architecture", "Container escape", "Privileged containers", "K8s RBAC abuse", "Pod escape & exposed etcd"],
        lab: {
          title: "Escape the Cluster",
          description: "Break out of a vulnerable Kubernetes pod.",
          steps: [
            "Identify the privileged pod misconfiguration",
            "Mount the host filesystem from inside the container",
            "Abuse RBAC to read cluster secrets",
            "Detect the escape with Falco rules",
          ],
        },
      },
      {
        id: "cl-3",
        code: "5.3",
        title: "CI/CD & Serverless Security",
        summary: "Poisoning the pipeline.",
        topics: ["GitHub Actions abuse", "Pipeline poisoning", "Dependency compromise", "Lambda attack surface", "Event injection"],
        lab: {
          title: "Pipeline Poisoning",
          description: "Compromise a build through a malicious dependency.",
          steps: [
            "Identify the untrusted input in the CI workflow",
            "Inject a payload via a poisoned dependency",
            "Exfiltrate the pipeline's secrets",
            "Harden the workflow with least-privilege tokens",
          ],
        },
      },
    ],
  },
  {
    id: "mobile-iot",
    num: 6,
    code: "Phase 06",
    title: "Mobile, IoT & Hardware Security",
    tagline: "Security beyond the server.",
    description:
      "Modern red teams hit phones, firmware, and embedded devices. Learn the attack surface most curricula ignore.",
    difficulty: "Advanced",
    accent: "offense",
    modules: [
      {
        id: "m-1",
        code: "6.1",
        title: "Mobile Application Security",
        summary: "The device in everyone's pocket.",
        topics: ["Android & iOS architecture", "Static & dynamic analysis", "Insecure storage", "Certificate pinning bypass", "Frida instrumentation"],
        lab: {
          title: "Reverse the App",
          description: "Analyze a vulnerable Android APK.",
          steps: [
            "Decompile the APK and review the manifest",
            "Locate hardcoded secrets and insecure storage",
            "Bypass root detection with Frida",
            "Intercept TLS traffic past certificate pinning",
          ],
        },
      },
      {
        id: "m-2",
        code: "6.2",
        title: "IoT & Firmware Security",
        summary: "Hacking the physical world.",
        topics: ["Firmware structure", "UART / SPI / I2C / JTAG", "Hardcoded credentials", "Firmware extraction (Binwalk)", "Emulation with QEMU"],
        lab: {
          title: "Firmware Forensics",
          description: "Extract secrets from a vulnerable firmware image.",
          steps: [
            "Carve the filesystem with binwalk",
            "Search the rootfs for hardcoded credentials",
            "Emulate the embedded web interface with QEMU",
            "Identify and document the firmware vulnerability",
          ],
        },
      },
    ],
  },
  {
    id: "ai-security",
    num: 7,
    code: "Phase 07",
    title: "AI & Adversarial Security",
    tagline: "Defending the intelligent era.",
    description:
      "The defining frontier. Attack and defend LLMs, ML pipelines, and AI-powered systems — the heart of Vaelora's mission.",
    difficulty: "Advanced",
    accent: "ai",
    modules: [
      {
        id: "ai-1",
        code: "7.1",
        title: "LLM & Prompt Security",
        summary: "Breaking and defending language models.",
        topics: ["Prompt injection", "Jailbreaks", "Data exfiltration via prompts", "Output handling", "Guardrail design"],
        lab: {
          title: "Jailbreak Lab",
          description: "Defeat — then defend — an AI assistant's guardrails.",
          steps: [
            "Craft a direct prompt injection to leak the system prompt",
            "Chain an indirect injection through retrieved content",
            "Design input/output filters to block the attack",
            "Validate your defenses against the original payloads",
          ],
        },
      },
      {
        id: "ai-2",
        code: "7.2",
        title: "Adversarial ML & Model Attacks",
        summary: "When the model itself is the target.",
        topics: ["Data poisoning", "Model evasion", "Membership inference", "Model extraction", "Supply-chain risks in ML"],
        lab: {
          title: "Poison the Model",
          description: "Demonstrate a poisoning attack on a classifier.",
          steps: [
            "Inject crafted samples into the training set",
            "Measure the backdoor's effect on predictions",
            "Detect the poisoning via anomaly analysis",
            "Propose a robust training mitigation",
          ],
        },
      },
    ],
  },
  {
    id: "soc",
    num: 8,
    code: "Phase 08",
    title: "Blue Team & SOC Operations",
    tagline: "Where defenders earn their living.",
    description:
      "Detection engineering, incident response, and the operational metrics that define real SOC performance.",
    difficulty: "Advanced",
    accent: "defense",
    modules: [
      {
        id: "s-1",
        code: "8.1",
        title: "SOC Engineering & Operational Metrics",
        summary: "Run a SOC like a business.",
        topics: ["MTTD & MTTR", "Alert fidelity & dwell time", "SLA & severity (P1–P4)", "Escalation matrices", "Tier 1/2/3 workflows"],
        lab: {
          title: "Run the SOC",
          description: "Operate a simulated security operations center.",
          steps: [
            "Triage a queue of incoming alerts by severity",
            "Calculate MTTD and MTTR from incident timestamps",
            "Build an escalation decision for a P1 incident",
            "Produce a SOC performance dashboard",
          ],
        },
      },
      {
        id: "s-2",
        code: "8.2",
        title: "Detection Engineering",
        summary: "Turn threats into reliable signals.",
        topics: ["Sigma rules", "YARA basics", "Alert tuning", "Noise reduction", "Detection lifecycle"],
        lab: {
          title: "Tune the SIEM",
          description: "Reduce alert fatigue without missing threats.",
          steps: [
            "Analyze a noisy detection's false-positive rate",
            "Write a Sigma rule to catch the real behavior",
            "Tune thresholds to cut noise by 80%",
            "Validate detection coverage against the attack",
          ],
        },
      },
      {
        id: "s-3",
        code: "8.3",
        title: "Incident Response & Threat Hunting",
        summary: "Find what the alerts missed.",
        topics: ["IR lifecycle", "Forensic triage", "Threat intel enrichment", "SOAR playbooks", "Cloud-native monitoring"],
        lab: {
          title: "Hunt the Threat",
          description: "Proactively hunt an undetected intrusion.",
          steps: [
            "Form a hypothesis from threat-intel TTPs",
            "Query logs for evidence of lateral movement",
            "Scope the compromise and contain affected hosts",
            "Write the post-incident report",
          ],
        },
      },
    ],
  },
  {
    id: "career",
    num: 9,
    code: "Phase 09",
    title: "Career Acceleration",
    tagline: "From skilled to hired.",
    description:
      "The bridge most programs skip: technical interviews, mock screens, communication, and real hiring readiness.",
    difficulty: "Intermediate",
    accent: "foundation",
    modules: [
      {
        id: "ca-1",
        code: "9.1",
        title: "Technical Interview Preparation",
        summary: "Pass the rounds that gate the job.",
        topics: ["SOC analyst questions", "Pentest interview scenarios", "Blue team technical screens", "AD attack scenarios", "Network troubleshooting rounds"],
        lab: {
          title: "Mock Technical Screen",
          description: "Walk through a realistic interview scenario.",
          steps: [
            "Answer a timed SOC triage scenario",
            "Whiteboard an Active Directory attack path",
            "Explain a finding to a non-technical stakeholder",
            "Self-assess against a hiring rubric",
          ],
        },
      },
      {
        id: "ca-2",
        code: "9.2",
        title: "Portfolio, Branding & Strategy",
        summary: "Make your skills undeniable.",
        topics: ["GitHub & CTF portfolio", "Public credibility", "Salary negotiation", "Freelance & consulting models", "Executive reporting"],
        lab: {
          title: "Build Your Proof",
          description: "Assemble a portfolio that gets callbacks.",
          steps: [
            "Audit your GitHub for recruiter-readiness",
            "Write up a lab as a public case study",
            "Draft a salary negotiation script",
            "Plan your first 3 public contributions",
          ],
        },
      },
    ],
  },
];

export function totalModules() {
  return phases.reduce((n, p) => n + p.modules.length, 0);
}
export function totalLabs() {
  return phases.reduce((n, p) => n + p.modules.filter((m) => m.lab).length, 0);
}
export function findModule(phaseId: string, moduleId: string) {
  const phase = phases.find((p) => p.id === phaseId);
  const module = phase?.modules.find((m) => m.id === moduleId);
  return { phase, module };
}
export function getPhase(id: string) {
  return phases.find((p) => p.id === id);
}
