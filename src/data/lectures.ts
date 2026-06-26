export interface Lecture {
  title: string;
  theory: string;
  example: string;
  mitigation: string;
}

export interface TopicLectures {
  topic: string;
  lectures: Lecture[];
}

export type LecturesMapping = Record<string, TopicLectures[]>;

// Helper function to build placeholder lectures for any topics list
export function makePlaceholders(moduleId: string, topics: string[]): TopicLectures[] {
  return topics.map((topic) => ({
    topic,
    lectures: [
      {
        title: topic,
        theory: `This section will cover the core theoretical concepts of ${topic.toLowerCase()} within module ${moduleId}. It introduces standard architecture and security considerations.`,
        example: `# Shell Command / Config Sample for ${topic}\n$ echo "Active target: ${topic}"\n# Run custom tool check or verification here`,
        mitigation: `Enforce strict access controls, apply latest patches, and configure monitoring for ${topic.toLowerCase()} anomalies.`,
      }
    ]
  }));
}

export const lectures: LecturesMapping = {
  "df-1": makePlaceholders("df-1", [
    "The Machine That Trusts Everyone",
    "The Hidden City Inside Your Computer",
    "The Memory Palace",
    "The Kingdom of Storage",
    "The Invisible Ruler of the Machine",
    "The Vaults, Keys, and Guards",
    "The Machine Inside The Machine",
    "Beyond Virtual Machines"
  ]),
  "df-2": makePlaceholders("df-2", [
    "Networking Fundamentals",
    "DNS",
    "HTTP/HTTPS",
    "Client-Server Architecture",
    "Cloud Computing Basics"
  ]),
  "pn-1": makePlaceholders("pn-1", [
    "Python",
    "Bash",
    "SQL",
    "JavaScript Fundamentals",
    "APIs",
    "Socket Programming",
    "Automation"
  ]),
  "pn-2": makePlaceholders("pn-2", [
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
  ]),
  "hb-1": makePlaceholders("hb-1", [
    "Nmap",
    "Burp Suite",
    "Enumeration",
    "Password Attacks",
    "Basic Exploitation"
  ]),
  "sa-1": makePlaceholders("sa-1", [
    "Linux Security",
    "Shell Scripting",
    "SSH",
    "PowerShell",
    "Active Directory Fundamentals",
    "Group Policy",
    "Event Logging",
    "Authentication Systems",
    "Access Control"
  ]),
  "was-1": makePlaceholders("was-1", [
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
  ]),
  "eh-1": makePlaceholders("eh-1", [
    "Reconnaissance",
    "OSINT",
    "Enumeration",
    "Vulnerability Assessment",
    "Exploitation",
    "Privilege Escalation",
    "Post Exploitation",
    "Reporting"
  ]),
  "ad-1": makePlaceholders("ad-1", [
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
  ]),
  "ccd-1": makePlaceholders("ccd-1", [
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
  ]),
  "ds-1": makePlaceholders("ds-1", [
    "SIEM",
    "Log Correlation",
    "Alert Triage",
    "Incident Response"
  ]),
  "ds-2": makePlaceholders("ds-2", [
    "Sigma Rules",
    "YARA Rules",
    "Detection Lifecycle",
    "Threat Intelligence Integration"
  ]),
  "ds-3": makePlaceholders("ds-3", [
    "IOC Hunting",
    "Behavioral Analytics",
    "ATT&CK Mapping",
    "Hypothesis-Driven Hunting"
  ]),
  "ds-4": makePlaceholders("ds-4", [
    "MTTD",
    "MTTR",
    "Alert Fidelity",
    "Detection Coverage",
    "SLA Management"
  ]),
  "ds-5": makePlaceholders("ds-5", [
    "Purple Team Methodology",
    "ATT&CK-Based Validation",
    "Detection Gap Analysis",
    "Adversary Emulation",
    "Threat-Informed Defense",
    "Security Control Validation"
  ]),
  "st-1": makePlaceholders("st-1", [
    "x86 Assembly",
    "Binary Analysis",
    "Dynamic Analysis",
    "Malware Behavior",
    "Obfuscation Techniques",
    "Ghidra"
  ]),
  "st-2": makePlaceholders("st-2", [
    "Memory Forensics",
    "Disk Forensics",
    "Log Analysis",
    "Evidence Preservation",
    "Incident Handling"
  ]),
  "st-3": makePlaceholders("st-3", [
    "Firmware Analysis",
    "UART",
    "SPI",
    "I2C",
    "JTAG",
    "Hardware Security"
  ]),
  "ai-1": makePlaceholders("ai-1", [
    "Machine Learning Fundamentals",
    "Large Language Models",
    "AI Threat Detection",
    "AI Malware Analysis",
    "AI-Assisted Reconnaissance",
    "Prompt Injection",
    "Jailbreaking",
    "Model Poisoning"
  ]),
  "grc-1": makePlaceholders("grc-1", [
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
  ]),
  "cca-1": makePlaceholders("cca-1", [
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
  ])
};
