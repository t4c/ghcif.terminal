const histDiv = document.getElementById('history');
const input = document.getElementById('in');
const pSpan = document.getElementById('p-span');
const cmdLine = document.querySelector('.cmd-line');
const rootStyle = document.documentElement.style;

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

input.disabled = false;
if (cmdLine) cmdLine.style.display = 'flex';
input.focus();

let user = 'guest';
let pwdMode = false;
let cmdHistory = [];
let histIndex = -1;
let compiled = false;    
let compiledRoot = false; 
let inExploits = false;

const guestFakeHist = [
    'whoami',
    'ls -la',
    'date',
    'uname -a',
    'cd /tmp',
    'ls',
    'cd ..',
    'cd .exploits',
    'ls -la',
    'cat userpriv.c',
    'gcc userpriv.c',
    './a.out',
    'exit',
    'cd /root',
    'sudo su',
    'su t4c',
    'help',
    'cat /etc/shadow'
];

const t4cFakeHist = [
    'netstat -tulpn',
    'docker ps -a',
    'tail -f /var/log/syslog',
    'grep -r "TODO" /var/www/html',
    'nmap -sS -p- 80.245.144.218',
    'msfconsole -x "use exploit/multi/handler; set LHOST 0.0.0.0; run"',
    'gcc -o exploit exploit.c', 
    './exploit', 
    'python cv_modern.py',
    'htop'
];

function sendLog(command) {
    if (!command) return;
    fetch('logger.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cmd: command, user: user })
    }).catch(err => console.error(err));
}

const updateVisuals = () => {
    if(user === 't4c') {
        rootStyle.setProperty('--curr', '#ff3333');
        input.className = 'style-root';
        pSpan.className = 'prompt style-root';
        pSpan.textContent = 't4c@ghcif:~#';
        inExploits = false;
    } else {
        rootStyle.setProperty('--curr', '#33ff00');
        input.className = 'style-guest';
        pSpan.className = 'prompt style-guest';
        pSpan.textContent = inExploits ? 'guest@ghcif:~/.exploits$' : 'guest@ghcif:~$';
    }
};
updateVisuals();

const rndIP = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
const dateStr = `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()} ${('0'+d.getHours()).slice(-2)}:${('0'+d.getMinutes()).slice(-2)}`;
document.getElementById('last-login').innerText = `Last login: ${dateStr} from ${rndIP()}`;

const fs = {
    'stats.txt': `name: Milan 't4c' Berger\nbday: Ã¼.â.1978\njob: Principal Solution Architect▒s\ndescr: Lovara, GenX, father of 1,█Principal Solution Architect, GF Pharma, Linux, Android, Google, carnivore, binary, neurodivergent,▒Pastafarian, Team AMG, troll ret., fnord.`,
    'hardware.txt': `/work: Dell Latitude 7410\n/home: TUXEDO Inf▓nityBook Pro 14\n/srv: Intel Xeon E542▒ - 16 GB - 1 GB/s\n/game: Playstation 5 (pro) custom plated`,
    'skills.txt': `OS: Linux (Gentoo, Debian, Ub▓ntu, RHEL, SLES)\noperating: Humans, Dogs, DBs, Mailserver, Containe▌\nbul▒shitbingo: k8s, docker, Postgre, Mari█DB, Cassandra, ITSec, Infosec, ITIL\ncerts: CEH, ECSA, ITILv4`,
    'non_work.txt': `my son and dog, training bjj, gaming (from Gran▓Tourismo over God of War to Mortal Kombat), low level soldering, 3d printing, urban farming, reading, happy kinkster`,
    'links.txt': `[ <a href="./ascii">ascii</a> ] ......... old nfo ascii arts\n[ <a href="./bambulab">bambulab▓</a> ] ..... 3D printing stuff\n[ <a href="./confixx">confixx</a> ] ....... real old Confixx resources\n[ <a href="./defac">defac</a> ] ......... ancient def█cements\n[ <a href="./images">images</a> ] ........ pixel arts\n[ <a href="./flipperzero">flipp█rzero</a> ] ... Flipper Zero resources\n[ <a href="./fun">fun</a> ] ........... dad humor inside...\n[ <a href="./recipes">recipes</a> ] ....... cook, create, and eat\n[ <a href="./scripts">scripts</a> ] ....... lous▒▒scripts here\n[ <a href="./sweetdeath">sweetdeath</a> ] .... real pain resource\n[ <a href="./toniebox">toniebox</a> ] ...... deprecated toniebox stuff\n[ <a href="./txt">txt</a> ] ........... some old texts gone here`,
    'contact.txt': `[ <a href="https://x.com/twit4c" target="_blank">X</a> ] ............... Twitter/X\n[ <a href="https://www.xing.com/profile/Milan_Berger/" target="_blank">Xing</a> ] ............ Xing Profile\n[ <a href="https://www.linkedin.com/in/milan-berger/" target="_blank">LinkedI▓</a> ] ........ LinkedIn Profile\n[ <a href="https://www.instagram.com/t4c_23/" target="_blank">Inst█gram</a> ] ....... Instagram\n[ <a href="https://github.com/t4c/" target="_blank">Github</a> ] .......... Github Profile\n[ <a href="https://makerworld.com/de/@AinOwge" target="_blank">Makerworld</a> ] ...... Makerworld\n[ <a href="https://www.printables.com/@ainowge" target="_blank">printables</a> ] ...... Printables\n[ <a href="https://t.me/ghcif" target="_blank">Telegram</a> ] ........ Telegram Gruppe\n[ MAIL ] ............ t4c@domain`,
    'legal.txt': `Input logging: We anonymously log unknown commands to improve the system. No IPs or personal data are stored. We still serve spacecookies 👽`,
    '/etc/passwd': `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nguest:x:1000:1000:Guest:/home/guest:/bin/bash`,
    '/etc/shadow': `root:$1$GT8a.0$P2g.5.i.7.l.0.0.0:19720:0:99999:7:::\nguest:$1$xyz$AbCdEfGhIjKlMnOpQrStUv:19720:0:99999:7:::`,
    'userpriv.c': `#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n#include <sys/types.h>\n\nint main() {\n    printf("[*] Probing kernel structures...\\n");\n    printf("[*] Found 'cred' struct at 0xffffffff81c4e100\\n");\n    printf("[*] Triggering race condition in slab allocator...\\n");\n    \n    sleep(1);\n    \n    printf("[+] Race won! Overwriting uid/gid...\\n");\n    \n    setresuid(0, 0, 0);\n    setresgid(0, 0, 0);\n    \n    if (getuid() == 0) {\n        printf("[+] Got root! Spawning shell...\\n");\n        system("/bin/bash");\n    } else {\n        printf("[-] Exploit failed.\\n");\n    }\n    return 0;\n}`,
    'exploit.c': `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    printf("Injecting payload...\\n");\n    system("cat /etc/shadow");\n    return 0;\n}`,
    'cv_modern.py': `import sys\n\ntry:\n    from fpdf import FPDF\nexcept ImportError:\n    print("\\n---------------------------------------------------------")\n    print("ERROR: The module 'fpdf' is missing.")\n    print("Please install it using the following command in your terminal:")\n    print("pip install fpdf")\n    print("---------------------------------------------------------\\n")\n    sys.exit(1)\n\nclass WenzkeCV(FPDF):\n    def header(self):\n        self.set_fill_color(60, 60, 60)\n        self.rect(0, 0, 70, 297, 'F')\n\n        if self.page_no() == 1:\n            self.set_xy(75, 20)\n            self.set_font('Helvetica', 'B', 24)\n            self.set_text_color(0)\n            self.cell(0, 10, 'MILAN BERGER', border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n            self.set_xy(75, 30)\n            self.set_font('Helvetica', '', 12)\n            self.set_text_color(100)\n            self.cell(0, 8, 'Principal Solution Architect', border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n\n    def footer(self):\n        self.set_y(-15)\n        self.set_x(70)\n        self.set_font('Helvetica', '', 8)\n        self.set_text_color(150)\n        self.cell(0, 10, f'Seite {self.page_no()}', border=0, align='R', new_x="RIGHT", new_y="TOP")\n\n    def draw_sidebar_content(self, certs, languages):\n        self.set_y(50)\n        self.set_left_margin(5)\n        self.set_right_margin(145)\n        self.set_text_color(255, 255, 255)\n\n        self.set_font('Helvetica', 'B', 11)\n        self.set_x(5)\n        self.cell(60, 8, "KONTAKT", border=0, align='L', new_x="LMARGIN", new_y="NEXT")    \n        self.set_font('Helvetica', '', 9)\n        self.set_x(5)\n        self.multi_cell(60, 5, "Bunzlauer Straße 61\\n90473 Nürnberg", align='L')\n        self.ln(8)\n\n        self.set_font('Helvetica', 'B', 11)\n        self.set_x(5)\n        self.cell(60, 8, "SPRACHEN", border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n        self.set_font('Helvetica', '', 9)\n        for lang in languages:\n            self.set_x(5)\n            self.cell(60, 5, lang, border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n        self.ln(8)\n\n        self.set_font('Helvetica', 'B', 11)\n        self.set_x(5)\n        self.cell(60, 8, "ZERTIFIKATE", border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n        self.set_font('Helvetica', '', 8)\n        for cert in certs:\n            self.set_x(5)\n            self.multi_cell(60, 4, f"- {cert}", align='L')\n            self.ln(1)\n        self.ln(5)\n\n    def section_title(self, title):\n        self.ln(5)\n        self.set_x(75)\n        self.set_font('Helvetica', 'B', 12)\n        self.set_text_color(30, 30, 30)\n        self.cell(0, 8, title.upper(), border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n        self.set_draw_color(200)\n        self.line(75, self.get_y(), 200, self.get_y())\n        self.ln(5)\n\n    def job_entry(self, date, company, role, details):\n        self.set_x(75)\n        self.set_font('Helvetica', 'B', 10)\n        self.set_text_color(0)\n        self.cell(35, 5, date, border=0, align='L', new_x="RIGHT", new_y="TOP")\n\n        self.set_font('Helvetica', 'B', 11)\n        self.cell(0, 5, company, border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n\n        self.set_x(110)\n        self.set_font('Helvetica', 'I', 10)\n        self.set_text_color(50)\n        self.cell(0, 5, role, border=0, align='L', new_x="LMARGIN", new_y="NEXT")\n\n        self.ln(2)\n        self.set_font('Helvetica', '', 10)\n        self.set_text_color(30)\n        for line in details:\n            self.set_x(110)\n            self.multi_cell(0, 5, f"- {line}", align='L')\n        self.ln(4)\n\n    def skill_block(self, category, items):\n        self.set_x(75)\n        self.set_font('Helvetica', 'B', 10)\n        self.set_text_color(0)\n        self.cell(40, 5, category + ":", border=0, align='L', new_x="RIGHT", new_y="TOP")\n        self.set_font('Helvetica', '', 10)\n        self.set_text_color(50)\n        self.multi_cell(0, 5, items, align='L')\n        self.ln(1)\n\ncerts_list = [\n    "LPT (Licensed Penetration Tester)",\n    "CEH (Certified Ethical Hacker)",\n    "ECSA (Security Analyst)",\n    "ITIL Foundation v4",\n    "Splunk Certified User",\n    "Ausbildereignung (IHK)"\n]\n\nlangs_list = [\n    "Deutsch (Muttersprache)",\n    "Englisch (Verhandlungssicher)"\n]\n\nsummary = (\n    "Erfahrener Technical Lead und Solution Architect. Kombination aus tiefer technischer "\n    "Expertise (Linux, K8s, Security) und C-Level Management-Erfahrung. "\n    "Fokus auf Managed Services und Prozessdigitalisierung."\n)\n\npdf = WenzkeCV()\npdf.set_auto_page_break(auto=True, margin=15)\n\npdf.add_page()\npdf.draw_sidebar_content(certs_list, langs_list)\n\npdf.set_left_margin(75)\npdf.set_right_margin(10)\npdf.set_y(45)\n\npdf.set_font('Helvetica', '', 10)\npdf.set_text_color(50)\npdf.multi_cell(0, 5, summary, align='L')\npdf.ln(5)\n\npdf.section_title("Berufserfahrung")\n\npdf.job_entry("04.2024 - heute", "Adesso as a service GmbH", "Principal Solution Architect & Teamlead", [\n    "Technical Lead Managed Service Infrastrukturen",\n    "Fachliche Führung & Architekturverantwortung",\n    "Tech Stack: Linux, K8s, Docker, DBs"\n])\n\npdf.job_entry("04.2021 - heute", "Pharmastore GmbH", "Stellvertretender Geschäftsführer", [\n    "Gesamtverantwortung IT-Modernisierung & Digitalisierung",\n    "Einführung Topix ERP, Shopware, Zeiterfassung",\n    "Operative Teamführung & Prozessoptimierung"\n])\n\npdf.job_entry("01.2018 - 03.2024", "System Vertrieb Alexander", "Big Data / Linux Systems Engineer", [\n    "Betrieb heterogener Linux- & Hadoop-Cluster",\n    "Aufbau Datamesh & Docker-Umgebungen",\n    "Consulting & Koordination"\n])\n\npdf.job_entry("08.2015 - 12.2017", "Diehl Connectivity Solutions", "Linux Systems Engineer", [\n    "Aufbau B2B 3rd Level Customer Support",\n    "Planung Cloud Backend & CERT Mitgliedschaft"\n])\n\npdf.job_entry("01.2015 - 04.2015", "Nureg AG", "Linux Systems Engineer", [\n    "Konfiguration Linux-Infrastruktur",\n    "Umsetzung Sicherheitsmaßnahmen"\n])\n\npdf.job_entry("11.2006 - 12.2014", "QSC AG", "System Engineer / IT Security", [\n    "Full-Managed Support & Security Audits (ISO 27001)",\n    "Technische Ausbildung von Azubis"\n])\n\npdf.add_page() \npdf.set_y(20) \n\npdf.section_title("Fachkenntnisse & Stack")\npdf.skill_block("Container", "Docker (Enterprise, Swarm), Ansible, Kubernetes basics")\npdf.skill_block("OS", "Linux Expert (RHEL, SLES, Debian, Ubuntu), Unix")\npdf.skill_block("Data/DB", "Cloudera, Kafka, MariaDB, Postgres, Splunk")\npdf.skill_block("Security", "Nessus, OpenVAS, metasploit, rfid/nfc, ISO 27001")\npdf.skill_block("Web/Tools", "Apache, Nginx, CheckMK, Nagios, Wireshark, Jira")\n\npdf.ln(5)\npdf.section_title("Ausgewählte Projekte")\npdf.job_entry("Laufend", "Managed Services (Adesso)", "Lead Architect", [\n    "Konzeption hochverfügbarer K8s-Umgebungen",\n    "Prozessoptimierung Datenanalyse"\n])\n\npdf.job_entry("Laufend", "Digitalisierung (Pharmastore)", "Projektleitung", [\n    "Einführung Warenwirtschaft (Topix) & Webshop (Shopware)",\n    "Modernisierung Mailserver & Security"\n])\n\npdf.job_entry("2022 - 2024", "Big Data Ops (Automotive)", "Ops Engineer", [\n    "Full Managed Service für Big Data Cluster",\n    "Tech: SuSE, Kafka, Trino, Minio, Spark"\n])\n\npdf.output("Milan_Berger_CV.pdf")\nprint("PDF created successfully")`
};

const cmds = {
    'ls': () => {
        let files = Object.keys(fs);
        
        if (user === 't4c') {
            let out = files.filter(f => !f.startsWith('/')).join('   ');
            if (compiledRoot) out += '   exploit';
            return out;
        }

        if (inExploits) {
            let out = 'userpriv.c';
            if (compiled) out += '   a.out';
            return out;
        } else {
            let visible = files.filter(f => 
                !f.startsWith('/') && 
                f !== 'userpriv.c' &&
                f !== 'exploit.c'
            );
            return visible.join('   ');
        }
    },
    'cd': (arg) => {
        if (!arg || arg === '~') {
            inExploits = false;
            updateVisuals();
            return null;
        }
        if (arg === '.exploits') {
            inExploits = true;
            updateVisuals();
            return null;
        }
        if (arg === '..') {
            inExploits = false;
            updateVisuals();
            return null;
        }
        return `cd: ${arg}: No such file or directory`;
    },
    'cat': (arg) => {
         if(!arg) return 'Usage: cat [filename]';
         
         if (arg === 'userpriv.c' && !inExploits && user !== 't4c') {
             return 'cat: userpriv.c: No such file or directory';
         }
         
         if (arg === 'exploit.c' && user !== 't4c') {
             return 'cat: exploit.c: Permission denied';
         }

         if (Object.prototype.hasOwnProperty.call(fs, arg)) return fs[arg];
         
         return `cat: ${arg}: No such file or directory`;
    },
    'gcc': (arg) => {
        if (inExploits && arg === 'userpriv.c') {
            compiled = true;
            return 'gcc: checking userpriv.c... OK\ngcc: compiling... OK\ngcc: linking... OK\n(Output written to a.out)';
        }
        
        if (user === 't4c' && arg === '-o exploit exploit.c') {
            compiledRoot = true;
            return 'gcc: checking exploit.c... OK\ngcc: compiling... OK\ngcc: linking... OK\n(Output written to exploit)';
        }

        if (!inExploits && user !== 't4c') return 'gcc: no input files';
        
        return `gcc: error: ${arg}: No such file or directory`;
    },
    './a.out': () => {
        if (!inExploits || !compiled) return 'bash: ./a.out: No such file or directory';
        
        if (cmdLine) cmdLine.style.display = 'none';
        
        const logs = [
            '[*] Probing kernel structures...',
            '[*] Found \'cred\' struct at 0xffffffff81c4e100',
            '[*] Triggering race condition in slab allocator...',
            '[*] Heap spraying...',
            '[+] Race won! Overwriting uid/gid...',
            '[+] UID=0 (root) GID=0 (root)',
            '[+] Spawning root shell...'
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i >= logs.length) {
                clearInterval(interval);
                setTimeout(() => {
                    user = 't4c';
                    compiled = false;
                    inExploits = false;
                    updateVisuals();
                    
                    if (cmdLine) cmdLine.style.display = 'flex';
                    input.focus();
                }, 800);
            } else {
                print(logs[i], false);
                document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
                i++;
            }
        }, 600);

        return null;
    },
    './exploit': () => {
        if (user !== 't4c' || !compiledRoot) return 'bash: ./exploit: No such file or directory';
        return 'Injecting payload... \nSUCCESS. \n\n (Nothing happened, but you looked cool doing it.)';
    },
    'more': (arg) => cmds['cat'](arg),
    'sudo': () => {
        if(user === 't4c') return 'root is allowed to do everything.';
        return `${user} is not in the sudoers file. This incident will be reported.`;
    },
    'id': () => {
        if (user === 't4c') {
            return 'uid=0(root) gid=0(root) groups=0(root)';
        }
        return 'uid=1000(guest) gid=1000(guest) groups=1000(guest)';
    },
    'df': () => `Filesystem     1K-blocks      Used Available Use% Mounted on\nudev             8106268         0   8106268   0% /dev\n/dev/sda1      479151840  42138116 412602740  10% /`,
    'mount': () => `/dev/sda1 on / type ext4 (rw,relatime)\nproc on /proc type proc (rw,nosuid,nodev)\nsysfs on /sys type sysfs (rw,nosuid,nodev)`,
    'du': () => {
        let size = 0;
        Object.values(fs).forEach(c => size += c.length);
        return `${size}\t.`;
    },
    'ss': () => `State    Recv-Q   Send-Q     Local Address:Port      Peer Address:Port\nLISTEN   0        128              0.0.0.0:22             0.0.0.0:*`,
    'netstat': () => `Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 0.0.0.0:22              0.0.0.0:* LISTEN`,
    'nmap': (arg) => {
        if (!arg) return 'Usage: nmap [target]';
        const args = arg.split(' ');
        const target = args[args.length - 1]; 
        const now = new Date();
        const dateStr = now.toISOString().slice(0,16).replace('T', ' ');

        print(`Starting Nmap 7.80 ( https://nmap.org ) at ${dateStr} CET`, false);
        if (cmdLine) cmdLine.style.display = 'none';

        setTimeout(() => {
            print(`Nmap scan report for ${target}\nHost is up (0.024s latency).\nNot shown: 998 closed ports\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\nNmap done: 1 IP address (1 host up) scanned in 3.14 seconds`, false);
            if (cmdLine) cmdLine.style.display = 'flex';
            input.focus();
            document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
        }, 3000);
        return null; 
    },
    'rm': (arg) => {
        if (arg.trim().startsWith('-rf')) {
            if (cmdLine) cmdLine.style.display = 'none';
            setTimeout(() => {
                print('<span style="color:#f00">nene hier löscht Du gar nix v^v oO v^v</span>', false);
                if (cmdLine) cmdLine.style.display = 'flex';
                input.focus();
            }, 2000);
            return 'rm: removing files...';
        }
        return `rm: cannot remove '${arg}': Permission denied`;
    },
    'help': () => 'COMMANDS: ls, cd, cat, gcc, nmap, lynx, mount, df, du, ss, netstat, clear, exit',
    'clear': () => { histDiv.innerHTML = ''; return null; },
    'whoami': () => user,
    'history': () => {
        const base = user === 't4c' ? t4cFakeHist : guestFakeHist;
        const full = [...base, ...cmdHistory];
        return full.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
    },
    'su': (arg) => {
        if(arg === 't4c') { 
            pwdMode = true; 
            input.style.color = 'transparent';
            input.style.textShadow = 'none';
            pSpan.textContent = 'Password:';
            return null; 
        }
        return 'User not found.';
    },
    'exit': () => {
        if(user === 't4c') {
            user = 'guest';
            updateVisuals();
            return 'logout';
        }
        location.reload(); 
        return 'logout';
    },
    'lynx': (arg) => {
        if (!arg) return 'Usage: lynx [url]';
        print(`Looking up ${escapeHTML(arg)}...`, false);
        if (cmdLine) cmdLine.style.display = 'none';
        setTimeout(() => {
             window.location.href = './index_old.html';
        }, 2000);
        return null;
    },
    'python': (arg) => {
        if (user === 't4c' && arg === 'cv_modern.py') return 'Generating CV... (Download started)';
        return 'python: permission denied';
    }
};

input.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value;
        const parts = val.split(' ');
        
        let availableFiles = [];
        if (inExploits) {
             availableFiles = ['userpriv.c'];
             if(compiled) availableFiles.push('a.out');
        } else {
             availableFiles = Object.keys(fs).filter(f => !f.startsWith('/') && f !== 'userpriv.c' && f !== 'exploit.c');
             availableFiles.push('.exploits');
             if(user === 't4c') availableFiles.push('exploit.c');
             if(compiledRoot) availableFiles.push('exploit');
        }

        if (parts.length === 1) {
            const match = Object.keys(cmds).find(c => c.startsWith(parts[0]));
            if(match) input.value = match + ' ';
        } else if (parts.length === 2) {
            const match = availableFiles.find(f => f.startsWith(parts[1]));
            if(match) input.value = parts[0] + ' ' + match;
        }
        return;
    }
    
    if (e.key === 'ArrowUp') {
        if (histIndex < cmdHistory.length - 1) {
            histIndex++;
            input.value = cmdHistory[cmdHistory.length - 1 - histIndex];
        }
        e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
        if (histIndex > 0) {
            histIndex--;
            input.value = cmdHistory[cmdHistory.length - 1 - histIndex];
        } else {
            histIndex = -1;
            input.value = '';
        }
        e.preventDefault();
    }
    
    if (e.key === 'Enter') {
        const raw = input.value;
        const val = raw.trim();

        if (pwdMode) {
            input.style.color = 'inherit';
            input.style.textShadow = 'inherit'; 
            print('Password:'); 

            if (val === 'fnord') {
                user = 't4c';
                updateVisuals();
            } else {
                print('su: Authentication failure');
                updateVisuals();
            }
            pwdMode = false;
            input.value = '';
            document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
            return;
        }

        if (/<script|onerror=|onload=|javascript:|iframe/i.test(val)) {
            document.cookie = "easterhegg=Nice try - try again harder your cookiemonster; max-age=31536000; path=/";
            
            const alertMatch = val.match(/alert\(\s*(['"]?)(.*?)\1\s*\)/);
            if (alertMatch) {
                setTimeout(() => alert(alertMatch[2]), 100);
            }

            print(`${pSpan.textContent} ${escapeHTML(raw)}`, true);
            print(`bash: ${escapeHTML(val.split(' ')[0])}: command not found`);
            
            input.value = '';
            histIndex = -1;
            document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
            return;
        }

        if(val) cmdHistory.push(val);
        histIndex = -1;
        
        print(`${pSpan.textContent} ${escapeHTML(raw)}`, true);

        const [cmd, ...args] = val.split(' ');
        if (Object.prototype.hasOwnProperty.call(cmds, cmd)) {
            const res = cmds[cmd](args.join(' '));
            if (res) print(res);
        } else if (val !== '') {
            print(`bash: ${escapeHTML(cmd)}: command not found`);
            sendLog(val);
        }
        
        input.value = '';
        document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
    }
});

function print(txt, isCmd = false) {
    const d = document.createElement('div');
    d.className = 'out';
    d.innerHTML = txt;
    
    if (isCmd) {
        d.className = `out ${user === 't4c' ? 'style-root' : 'style-guest'}`;
    } else {
        d.style.color = '#ccc';
    }
    
    histDiv.appendChild(d);
}
