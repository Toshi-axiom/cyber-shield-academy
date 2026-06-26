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
    id: "digital-foundations",
    num: 0,
    code: "Phase 00",
    title: "Digital Foundations",
    tagline: "Master the digital landscape.",
    description:
      "Provide foundational understanding of computing systems and internet technologies.",
    difficulty: "Beginner",
    accent: "foundation",
    modules: [
      {
        id: "intro-1",
        code: "0.0",
        title: "Introduction to Cybersecurity",
        summary: "Understand the real-world attack lifecycle, adversary profiles, and Vaelora's defense philosophy.",
        topics: [
          "The Attack Lifecycle"
        ]
      },
      {
        id: "df-1",
        code: "0.1",
        title: "Computer Systems",
        summary: "Understand hardware, operating systems, and virtualization.",
        topics: [
          "CPU Architecture",
          "Memory Management",
          "Storage Systems",
          "Operating Systems",
          "Identity & Trust",
          "Virtualization",
          "Containers"
        ],
        lab: {
          title: "System Discovery Lab",
          description: "Inspect system parameters and container runtimes.",
          steps: [
            "Identify CPU structure and memory distribution",
            "Verify partition layouts and mounted filesystems",
            "List running services under the host OS",
            "Run a mock container container checklist"
          ]
        }
      },
      {
        id: "df-2",
        code: "0.2",
        title: "Internet Technologies",
        summary: "How the global net resolves and routes information.",
        topics: [
          "Networking Fundamentals",
          "DNS",
          "HTTP/HTTPS",
          "Client-Server Architecture",
          "Cloud Computing Basics"
        ],
        lab: {
          title: "Web Inspector Lab",
          description: "Audit web payloads and trace DNS routes.",
          steps: [
            "Resolve hostnames to active IP targets",
            "Audit raw HTTP/HTTPS headers",
            "Inspect client-server headers",
            "Document cloud provider zones"
          ]
        }
      }
    ]
  },
  {
    id: "programming-networking",
    num: 1,
    code: "Phase 01",
    title: "Programming & Networking",
    tagline: "Speak the language of computers and networks.",
    description:
      "Build automation scripts, learn socket programming, and dive deep into network packets and protocols.",
    difficulty: "Beginner",
    accent: "foundation",
    modules: [
      {
        id: "pn-1",
        code: "1.1",
        title: "Programming for Security",
        summary: "Automate security tasks, query databases, and script in Python & Bash.",
        topics: [
          "Python",
          "Bash",
          "SQL",
          "JavaScript Fundamentals",
          "APIs",
          "Socket Programming",
          "Automation"
        ],
        lab: {
          title: "Port Scanner Developer",
          description: "Develop a custom port scanner and log auditor.",
          steps: [
            "Build a raw TCP socket connector in Python",
            "Write a bash wrapper to loop through active hosts",
            "Implement basic SQL queries to log results",
            "Parse JSON payloads from an external vulnerability API"
          ]
        }
      },
      {
        id: "pn-2",
        code: "1.2",
        title: "Networking Deep Dive",
        summary: "Analyze packets, understand routing tables, and dissect network interfaces.",
        topics: [
          "OSI Model",
          "TCP/IP",
          "Routing",
          "Switching",
          "VLANs",
          "Firewalls",
          "VPNs",
          "DNS",
          "SMB",
          "LDAP"
        ],
        lab: {
          title: "Network Traffic Dissector",
          description: "Analyze captured traffic and configure routing policies.",
          steps: [
            "Examine TCP handshakes and flags in Wireshark",
            "Audit Active Directory SMB/LDAP packets",
            "Configure a router filter block",
            "Identify anomalous protocol tunneling"
          ]
        }
      }
    ]
  },
  {
    id: "hacker-bootcamp",
    num: 1.5,
    code: "Phase 1.5",
    title: "Hacker Bootcamp",
    tagline: "Enter the mind of the attacker early.",
    description:
      "Introduce students to offensive security early in the curriculum to increase engagement and motivation.",
    difficulty: "Beginner",
    accent: "offense",
    modules: [
      {
        id: "hb-1",
        code: "1.5",
        title: "Offensive Security Basics",
        summary: "Practice basic enumeration and exploitation on a target.",
        topics: [
          "Nmap",
          "Burp Suite",
          "Enumeration",
          "Password Attacks",
          "Basic Exploitation"
        ],
        lab: {
          title: "Bootcamp CTF",
          description: "Run basic scanning and password cracking tools to capture the flag.",
          steps: [
            "Run an Nmap scan to find open ports",
            "Intercept HTTP requests with Burp Suite",
            "Launch a brute-force password attack",
            "Exploit a simple vulnerable web service"
          ]
        }
      }
    ]
  },
  {
    id: "system-administration",
    num: 2,
    code: "Phase 02",
    title: "Linux, Windows & System Administration",
    tagline: "Control the environments you defend.",
    description:
      "Establish administrative access controls, secure services, and manage identities across enterprise networks.",
    difficulty: "Intermediate",
    accent: "foundation",
    modules: [
      {
        id: "sa-1",
        code: "2.1",
        title: "Enterprise Administration",
        summary: "Secure operating systems and directory services.",
        topics: [
          "Linux Security",
          "Shell Scripting",
          "SSH",
          "PowerShell",
          "Active Directory Fundamentals",
          "Group Policy",
          "Event Logging",
          "Authentication Systems",
          "Access Control"
        ],
        lab: {
          title: "Domain Hardening",
          description: "Secure an administrative endpoint and Active Directory tree.",
          steps: [
            "Configure host-based firewall policies and SSH keys",
            "Write a PowerShell script to audit domain users",
            "Establish strict Group Policies (GPOs) for system access",
            "Inspect event logs to trace unauthorized access"
          ]
        }
      }
    ]
  },
  {
    id: "web-security",
    num: 3,
    code: "Phase 03",
    title: "Web Application Security",
    tagline: "Find and fix vulnerabilities on the web.",
    description:
      "Analyze web architectures, exploit OWASP Top 10 vulnerabilities, and implement secure coding controls.",
    difficulty: "Intermediate",
    accent: "offense",
    modules: [
      {
        id: "was-1",
        code: "3.1",
        title: "Web Vulnerability Analysis",
        summary: "Audit and exploit a web-based e-commerce platform.",
        topics: [
          "Web Architecture",
          "Sessions and Cookies",
          "JWT Authentication",
          "REST APIs",
          "OWASP Top 10",
          "SQL Injection",
          "XSS",
          "CSRF",
          "SSRF",
          "File Upload Vulnerabilities",
          "Secure Coding Principles"
        ],
        lab: {
          title: "Vulnerable Shop Hack",
          description: "Audit and exploit a web-based e-commerce platform.",
          steps: [
            "Bypass authentication via SQL injection",
            "Exploit XSS to capture administrative session cookies",
            "Chain an SSRF vulnerability to read server metadata",
            "Remediate code vulnerabilities using parameterization"
          ]
        }
      }
    ]
  },
  {
    id: "ethical-hacking",
    num: 4,
    code: "Phase 04",
    title: "Ethical Hacking & Penetration Testing",
    tagline: "Conduct professional offensive assessments.",
    description:
      "Recon, scan, exploit, escalate, and report. Master the modern pentester toolkit.",
    difficulty: "Intermediate",
    accent: "offense",
    modules: [
      {
        id: "eh-1",
        code: "4.1",
        title: "Penetration Testing Operations",
        summary: "Execute a full penetration test against a network host.",
        topics: [
          "Reconnaissance",
          "OSINT",
          "Enumeration",
          "Vulnerability Assessment",
          "Exploitation",
          "Privilege Escalation",
          "Post Exploitation",
          "Reporting"
        ],
        lab: {
          title: "Foothold to Domain Admin",
          description: "Execute a full penetration test against a network host.",
          steps: [
            "Conduct passive OSINT to identify user domains",
            "Scan target services and identify exploitable CVEs",
            "Compromise the user shell and escalate privileges",
            "Draft a professional executive remediation report"
          ]
        }
      }
    ]
  },
  {
    id: "active-directory-attacks",
    num: 5,
    code: "Phase 05",
    title: "Active Directory & Enterprise Attacks",
    tagline: "Compromise and secure directory services.",
    description:
      "Explore Kerberos vulnerabilities, trust relationships, BloodHound analysis, and Active Directory hardening.",
    difficulty: "Advanced",
    accent: "offense",
    modules: [
      {
        id: "ad-1",
        code: "5.1",
        title: "AD Domain Attacks",
        summary: "Audit and compromise a mock Active Directory domain controller.",
        topics: [
          "Active Directory Architecture",
          "Kerberos",
          "LDAP",
          "Trust Relationships",
          "BloodHound Analysis",
          "Kerberoasting",
          "AS-REP Roasting",
          "Pass-the-Hash",
          "Pass-the-Ticket",
          "Golden Ticket",
          "Silver Ticket",
          "DCSync",
          "Active Directory Hardening",
          "Tiered Administration",
          "Identity Security"
        ],
        lab: {
          title: "Domain Domination",
          description: "Audit and compromise a mock Active Directory domain controller.",
          steps: [
            "Run BloodHound to map privilege escalation paths",
            "Extract Kerberos ticket hashes via Kerberoasting",
            "Impersonate administrator using a Golden Ticket",
            "Implement Active Directory hardening and tiering"
          ]
        }
      }
    ]
  },
  {
    id: "cloud-containers-devsecops",
    num: 6,
    code: "Phase 06",
    title: "Cloud, Containers & DevSecOps",
    tagline: "Secure modern cloud infrastructure.",
    description:
      "Secure container workloads, Kubernetes environments, CI/CD pipelines, and IAM configurations.",
    difficulty: "Advanced",
    accent: "cloud",
    modules: [
      {
        id: "ccd-1",
        code: "6.1",
        title: "Cloud Security Architecture",
        summary: "Audit cloud identity controls and secure container configurations.",
        topics: [
          "AWS Security",
          "Azure Security",
          "GCP Security",
          "IAM Security",
          "Docker Security",
          "Container Escapes",
          "Kubernetes Security",
          "RBAC Abuse",
          "CI/CD Security",
          "GitHub Actions Security",
          "Dependency Attacks",
          "Serverless Security",
          "Cloud Detection Engineering"
        ],
        lab: {
          title: "Cloud Infrastructure Audit",
          description: "Audit cloud identity controls and secure container configurations.",
          steps: [
            "Audit IAM credentials for excessive privileges",
            "Exploit a container escape to reach the host system",
            "Configure Kubernetes RBAC rules under least-privilege",
            "Implement automated dependency scans in the build pipeline"
          ]
        }
      }
    ]
  },
  {
    id: "defensive-security",
    num: 7,
    code: "Phase 07",
    title: "Defensive Security, SOC & Purple Teaming",
    tagline: "Monitor, detect, and hunt threat actors.",
    description:
      "Run SOC operations, compile Sigma/YARA rules, hunt advanced threats, and validate controls via purple teaming.",
    difficulty: "Advanced",
    accent: "defense",
    modules: [
      {
        id: "ds-1",
        code: "7.1",
        title: "Security Operations Center",
        summary: "Triage raw events inside a simulated SIEM system.",
        topics: [
          "SIEM",
          "Log Correlation",
          "Alert Triage",
          "Incident Response"
        ],
        lab: {
          title: "Alert Triage Lab",
          description: "Triage raw events inside a simulated SIEM system.",
          steps: [
            "Correlate syslog traffic to identify scanning patterns",
            "Grade alerts using a standardized severity index",
            "Run a mock containment playbook against a compromised host"
          ]
        }
      },
      {
        id: "ds-2",
        code: "7.2",
        title: "Detection Engineering",
        summary: "Develop detection rules for common malware and exploits.",
        topics: [
          "Sigma Rules",
          "YARA Rules",
          "Detection Lifecycle",
          "Threat Intelligence Integration"
        ],
        lab: {
          title: "Signature Compiler",
          description: "Develop detection rules for common malware and exploits.",
          steps: [
            "Write a YARA rule targeting a specific web shell signature",
            "Draft a Sigma rule to detect LSASS memory dumping",
            "Integrate threat indicators into active SIEM indexes"
          ]
        }
      },
      {
        id: "ds-3",
        code: "7.3",
        title: "Threat Hunting",
        summary: "Formulate and run a threat hunt in log records.",
        topics: [
          "IOC Hunting",
          "Behavioral Analytics",
          "ATT&CK Mapping",
          "Hypothesis-Driven Hunting"
        ],
        lab: {
          title: "Hypothesis Hunter",
          description: "Formulate and run a threat hunt in log records.",
          steps: [
            "Create a hunting hypothesis for lateral movement",
            "Query authentication logs using behavioral patterns",
            "Map anomalies back to MITRE ATT&CK techniques"
          ]
        }
      },
      {
        id: "ds-4",
        code: "7.4",
        title: "SOC Engineering",
        summary: "Optimize alert configurations to reduce noise.",
        topics: [
          "MTTD",
          "MTTR",
          "Alert Fidelity",
          "Detection Coverage",
          "SLA Management"
        ],
        lab: {
          title: "Metrics Optimizer",
          description: "Optimize alert configurations to reduce noise.",
          steps: [
            "Audit false positive ratios in existing alerts",
            "Tune detection rules to decrease alert fatigue",
            "Measure mean time to detect (MTTD) on historic runs"
          ]
        }
      },
      {
        id: "ds-5",
        code: "7.5",
        title: "Purple Team Operations",
        summary: "Simulate attacks and verify detection triggers.",
        topics: [
          "Purple Team Methodology",
          "ATT&CK-Based Validation",
          "Detection Gap Analysis",
          "Adversary Emulation",
          "Threat-Informed Defense",
          "Security Control Validation"
        ],
        lab: {
          title: "Purple Team Simulator",
          description: "Simulate attacks and verify detection triggers.",
          steps: [
            "Run adversary emulation scripts using Atomic Red Team",
            "Perform a gap analysis on system log collection",
            "Validate firewall block policies against attack vectors"
          ]
        }
      }
    ]
  },
  {
    id: "specialization-tracks",
    num: 8,
    code: "Phase 08",
    title: "Specialization Tracks",
    tagline: "Specialize in a high-demand domain.",
    description:
      "Choose a path: Malware Analysis, Digital Forensics & Incident Response, or IoT & Hardware Security.",
    difficulty: "Advanced",
    accent: "defense",
    modules: [
      {
        id: "st-1",
        code: "8.1",
        title: "Malware Analysis & Reverse Engineering",
        summary: "Analyze compiled x86 disassembly in Ghidra and trace malware behavior.",
        topics: [
          "x86 Assembly",
          "Binary Analysis",
          "Dynamic Analysis",
          "Malware Behavior",
          "Obfuscation Techniques",
          "Ghidra"
        ],
        lab: {
          title: "Malware Reverse Lab",
          description: "Analyze a malicious binary using Ghidra and dynamic execution.",
          steps: [
            "Analyze compiled x86 disassembly in Ghidra",
            "Audit system modifications using dynamic monitoring tools",
            "De-obfuscate strings in memory dumps"
          ]
        }
      },
      {
        id: "st-2",
        code: "8.2",
        title: "Digital Forensics & Incident Response",
        summary: "Perform deep forensics on a compromised memory dump and reconstruct timelines.",
        topics: [
          "Memory Forensics",
          "Disk Forensics",
          "Log Analysis",
          "Evidence Preservation",
          "Incident Handling"
        ],
        lab: {
          title: "Memory Investigator",
          description: "Perform deep forensics on a compromised memory dump.",
          steps: [
            "Extract process lists and network states from volatile memory",
            "Preserve storage device copies using hashing",
            "Construct a master incident timeline from registry logs"
          ]
        }
      },
      {
        id: "st-3",
        code: "8.3",
        title: "IoT & Embedded Security",
        summary: "Decompile firmware filesystem structures using Binwalk and test hardware interfaces.",
        topics: [
          "Firmware Analysis",
          "UART",
          "SPI",
          "I2C",
          "JTAG",
          "Hardware Security"
        ],
        lab: {
          title: "Firmware Extractor",
          description: "Decompress and analyze embedded firmware.",
          steps: [
            "Decompile firmware filesystem structures using Binwalk",
            "Identify hardcoded keys in application code",
            "Map physical debugging pins (UART/JTAG) on a diagram"
          ]
        }
      }
    ]
  },
  {
    id: "ai-security",
    num: 9,
    code: "Phase 09",
    title: "AI for Cyber Security",
    tagline: "Defend the artificial intelligence boundary.",
    description:
      "Build AI-driven security defenses, defend models against poisoning, prompt injection, and jailbreaks.",
    difficulty: "Advanced",
    accent: "ai",
    modules: [
      {
        id: "ai-1",
        code: "9.1",
        title: "AI-Powered Defense",
        summary: "Attack and defend an LLM integration against prompt injections.",
        topics: [
          "Machine Learning Fundamentals",
          "Large Language Models",
          "AI Threat Detection",
          "AI Malware Analysis",
          "AI-Assisted Reconnaissance",
          "Prompt Injection",
          "Jailbreaking",
          "Model Poisoning"
        ],
        lab: {
          title: "LLM Hardening Lab",
          description: "Attack and defend an LLM integration against prompt injections.",
          steps: [
            "Bypass model safety filters using a jailbreak payload",
            "Audit training datasets for data poisoning samples",
            "Implement an input-filtering guardrail model",
            "Test defensive checks against known bypass patterns"
          ]
        }
      }
    ]
  },
  {
    id: "governance-risk-compliance",
    num: 10,
    code: "Phase 10",
    title: "Governance, Risk & Compliance",
    tagline: "Align cybersecurity with enterprise goals.",
    description:
      "Audit risk, analyze compliance frameworks (NIST, ISO 27001), and build risk reports.",
    difficulty: "Intermediate",
    accent: "foundation",
    modules: [
      {
        id: "grc-1",
        code: "10.1",
        title: "Enterprise Governance",
        summary: "Perform a formal risk assessment for an enterprise infrastructure.",
        topics: [
          "NIST Cybersecurity Framework",
          "ISO 27001",
          "CIS Controls",
          "GDPR",
          "Indian IT Act",
          "Risk Assessment",
          "Rules of Engagement",
          "Security Governance",
          "Compliance Auditing",
          "Executive Reporting",
          "Stakeholder Communication",
          "Risk Communication"
        ],
        lab: {
          title: "Risk Assessment Audit",
          description: "Perform a formal risk assessment for an enterprise infrastructure.",
          steps: [
            "Map system assets against NIST CSF controls",
            "Calculate risk scores based on likelihood and impact",
            "Audit company policy against GDPR and IT Act standards",
            "Write a compliance audit and executive risk report"
          ]
        }
      }
    ]
  },
  {
    id: "capstone-career",
    num: 11,
    code: "Phase 11",
    title: "Capstone & Career Acceleration",
    tagline: "Synthesize your skills and get hired.",
    description:
      "Build a major capstone project, research vulnerabilities, and prepare for interviews.",
    difficulty: "Advanced",
    accent: "foundation",
    modules: [
      {
        id: "cca-1",
        code: "11.1",
        title: "Career Acceleration Operations",
        summary: "Assemble a professional portfolio and perform a mock interview review.",
        topics: [
          "Responsible Disclosure",
          "Scope Analysis",
          "Recon Methodology",
          "Asset Discovery",
          "Vulnerability Chaining",
          "Report Writing",
          "Public Research Publication",
          "Technical Interviews",
          "Mock Interviews",
          "Salary Negotiation",
          "Consulting Models",
          "Freelancing Strategy",
          "GitHub Portfolio Review",
          "Professional Branding"
        ],
        lab: {
          title: "Dossier Verification",
          description: "Assemble a professional portfolio and perform a mock interview review.",
          steps: [
            "Structure a public GitHub security repository",
            "Document a mock penetration test or vulnerability finding",
            "Complete a mock technical screen and salary review",
            "Draft a vulnerability report following disclosure standards"
          ]
        }
      }
    ]
  }
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
