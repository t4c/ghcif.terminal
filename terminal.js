const histDiv = document.getElementById('history');
const input = document.getElementById('in');
const pSpan = document.getElementById('p-span');
const cmdLine = document.querySelector('.cmd-line');
const rootStyle = document.documentElement.style;

input.disabled = false;
if (cmdLine) cmdLine.style.display = 'flex';
input.focus();

let user = 'guest';
let pwdMode = false;
let cmdHistory = [];
let histIndex = -1;
let compiled = false;

const guestFakeHist = [
    'ls -la',
    'cd /root',
    'sudo su',
    'su t4c',
    'admin',
    'passwort',
    'lss', 
    'sl',
    'help',
    'cat /etc/shadow'
];

const t4cFakeHist = [
    'netstat -tulpn',
    'docker ps -a',
    'tail -f /var/log/syslog',
    'grep -r "TODO" /var/www/html',
    'nmap -sS -p- 10.0.0.1',
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
    } else {
        rootStyle.setProperty('--curr', '#33ff00');
        input.className = 'style-guest';
        pSpan.className = 'prompt style-guest';
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
    'contact.txt': `[ <a href="#">X</a> ] ............... Twitter/X\n[ <a href="#">Xing</a> ] ............ Xing Profile\n[ <a href="#">LinkedI▓</a> ] ........ LinkedIn Profile\n[ <a href="#">Inst█gram</a> ] ....... Instagram\n[ <a href="#">Makerworld</a> ] ...... Makerworld\n[ <a href="#">printables</a> ] ...... Printables\n[ MAIL ] ............ t4c@domain\n[ IRC ] ............. #ghcif.de@IRCNet`,
    'legal.txt': `Input logging: We anonymously log unknown commands to improve the system. No IPs or personal data are stored. We still serve spacecookies 👽`,
    'exploit.c': `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    printf("Injecting payload...\\n");\n    system("cat /etc/shadow");\n    return 0;\n}`,
    'cv_modern.py': `import sys

try:
    from fpdf import FPDF
except ImportError:
    print("\\n---------------------------------------------------------")
    print("ERROR: The module 'fpdf' is missing.")
    print("Please install it using the following command in your terminal:")
    print("pip install fpdf")
    print("---------------------------------------------------------\\n")
    sys.exit(1)

class WenzkeCV(FPDF):
    def header(self):
        self.set_fill_color(60, 60, 60)
        self.rect(0, 0, 70, 297, 'F')

        if self.page_no() == 1:
            self.set_xy(75, 20)
            self.set_font('Helvetica', 'B', 24)
            self.set_text_color(0)
            self.cell(0, 10, 'MILAN BERGER', border=0, align='L', new_x="LMARGIN", new_y="NEXT")
            self.set_xy(75, 30)
            self.set_font('Helvetica', '', 12)
            self.set_text_color(100)
            self.cell(0, 8, 'Principal Solution Architect', border=0, align='L', new_x="LMARGIN", new_y="NEXT")

    def footer(self):
        self.set_y(-15)
        self.set_x(70)
        self.set_font('Helvetica', '', 8)
        self.set_text_color(150)
        self.cell(0, 10, f'Seite {self.page_no()}', border=0, align='R', new_x="RIGHT", new_y="TOP")

    def draw_sidebar_content(self, certs, languages):
        self.set_y(50)
        self.set_left_margin(5)
        self.set_right_margin(145)
        self.set_text_color(255, 255, 255)

        # CONTACT
        self.set_font('Helvetica', 'B', 11)
        self.set_x(5)
        self.cell(60, 8, "KONTAKT", border=0, align='L', new_x="LMARGIN", new_y="NEXT")    
        self.set_font('Helvetica', '', 9)
        self.set_x(5)
        self.multi_cell(60, 5, "Bunzlauer Straße 61\\n90473 Nürnberg", align='L')
        self.ln(8)

        # lang
        self.set_font('Helvetica', 'B', 11)
        self.set_x(5)
        self.cell(60, 8, "SPRACHEN", border=0, align='L', new_x="LMARGIN", new_y="NEXT")
        self.set_font('Helvetica', '', 9)
        for lang in languages:
            self.set_x(5)
            self.cell(60, 5, lang, border=0, align='L', new_x="LMARGIN", new_y="NEXT")
        self.ln(8)

        # certs
        self.set_font('Helvetica', 'B', 11)
        self.set_x(5)
        self.cell(60, 8, "ZERTIFIKATE", border=0, align='L', new_x="LMARGIN", new_y="NEXT")
        self.set_font('Helvetica', '', 8)
        for cert in certs:
            self.set_x(5)
            self.multi_cell(60, 4, f"- {cert}", align='L')
            self.ln(1)
        self.ln(5)

    def section_title(self, title):
        self.ln(5)
        self.set_x(75)
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(30, 30, 30)
        self.cell(0, 8, title.upper(), border=0, align='L', new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(200)
        self.line(75, self.get_y(), 200, self.get_y())
        self.ln(5)

    def job_entry(self, date, company, role, details):
        self.set_x(75)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(0)
        self.cell(35, 5, date, border=0, align='L', new_x="RIGHT", new_y="TOP")

        # Company
        self.set_font('Helvetica', 'B', 11)
        self.cell(0, 5, company, border=0, align='L', new_x="LMARGIN", new_y="NEXT")

        # Role
        self.set_x(110)
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(50)
        self.cell(0, 5, role, border=0, align='L', new_x="LMARGIN", new_y="NEXT")

        # Details
        self.ln(2)
        self.set_font('Helvetica', '', 10)
        self.set_text_color(30)
        for line in details:
            self.set_x(110)
            self.multi_cell(0, 5, f"- {line}", align='L')
        self.ln(4)

    def skill_block(self, category, items):
        self.set_x(75)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(0)
        self.cell(40, 5, category + ":", border=0, align='L', new_x="RIGHT", new_y="TOP")
        self.set_font('Helvetica', '', 10)
        self.set_text_color(50)
        self.multi_cell(0, 5, items, align='L')
        self.ln(1)

certs_list = [
    "LPT (Licensed Penetration Tester)",
    "CEH (Certified Ethical Hacker)",
    "ECSA (Security Analyst)",
    "ITIL Foundation v4",
    "Splunk Certified User",
    "Ausbildereignung (IHK)"
]

langs_list = [
    "Deutsch (Muttersprache)",
    "Englisch (Verhandlungssicher)"
]

summary = (
    "Erfahrener Technical Lead und Solution Architect. Kombination aus tiefer technischer "
    "Expertise (Linux, K8s, Security) und C-Level Management-Erfahrung. "
    "Fokus auf Managed Services und Prozessdigitalisierung."
)

pdf = WenzkeCV()
pdf.set_auto_page_break(auto=True, margin=15)

pdf.add_page()
pdf.draw_sidebar_content(certs_list, langs_list)

pdf.set_left_margin(75)
pdf.set_right_margin(10)
pdf.set_y(45)

pdf.set_font('Helvetica', '', 10)
pdf.set_text_color(50)
pdf.multi_cell(0, 5, summary, align='L')
pdf.ln(5)

# experience
pdf.section_title("Berufserfahrung")

# Adesso
pdf.job_entry("04.2024 - heute", "Adesso as a service GmbH", "Principal Solution Architect & Teamlead", [
    "Technical Lead Managed Service Infrastrukturen",
    "Fachliche Führung & Architekturverantwortung",
    "Tech Stack: Linux, K8s, Docker, DBs"
])

# Pharmastore
pdf.job_entry("04.2021 - heute", "Pharmastore GmbH", "Stellvertretender Geschäftsführer", [
    "Gesamtverantwortung IT-Modernisierung & Digitalisierung",
    "Einführung Topix ERP, Shopware, Zeiterfassung",
    "Operative Teamführung & Prozessoptimierung"
])

# SVA
pdf.job_entry("01.2018 - 03.2024", "System Vertrieb Alexander", "Big Data / Linux Systems Engineer", [
    "Betrieb heterogener Linux- & Hadoop-Cluster",
    "Aufbau Datamesh & Docker-Umgebungen",
    "Consulting & Koordination"
])

# Diehl
pdf.job_entry("08.2015 - 12.2017", "Diehl Connectivity Solutions", "Linux Systems Engineer", [
    "Aufbau B2B 3rd Level Customer Support",
    "Planung Cloud Backend & CERT Mitgliedschaft"
])

# Nureg
pdf.job_entry("01.2015 - 04.2015", "Nureg AG", "Linux Systems Engineer", [
    "Konfiguration Linux-Infrastruktur",
    "Umsetzung Sicherheitsmaßnahmen"
])

# QSC
pdf.job_entry("11.2006 - 12.2014", "QSC AG", "System Engineer / IT Security", [
    "Full-Managed Support & Security Audits (ISO 27001)",
    "Technische Ausbildung von Azubis"
])

# hard break to page 2
pdf.add_page() 
pdf.set_y(20) 

# skills
pdf.section_title("Fachkenntnisse & Stack")
pdf.skill_block("Container", "Docker (Enterprise, Swarm), Ansible, Kubernetes basics")
pdf.skill_block("OS", "Linux Expert (RHEL, SLES, Debian, Ubuntu), Unix")
pdf.skill_block("Data/DB", "Cloudera, Kafka, MariaDB, Postgres, Splunk")
pdf.skill_block("Security", "Nessus, OpenVAS, metasploit, rfid/nfc, ISO 27001")
pdf.skill_block("Web/Tools", "Apache, Nginx, CheckMK, Nagios, Wireshark, Jira")

# Selected Projects
pdf.ln(5)
pdf.section_title("Ausgewählte Projekte")
pdf.job_entry("Laufend", "Managed Services (Adesso)", "Lead Architect", [
    "Konzeption hochverfügbarer K8s-Umgebungen",
    "Prozessoptimierung Datenanalyse"
])

pdf.job_entry("Laufend", "Digitalisierung (Pharmastore)", "Projektleitung", [
    "Einführung Warenwirtschaft (Topix) & Webshop (Shopware)",
    "Modernisierung Mailserver & Security"
])

pdf.job_entry("2022 - 2024", "Big Data Ops (Automotive)", "Ops Engineer", [
    "Full Managed Service für Big Data Cluster",
    "Tech: SuSE, Kafka, Trino, Minio, Spark"
])

pdf.output("Milan_Berger_CV.pdf")
print("PDF created successfully")`
};

const cmds = {
    'ls': () => {
        let files = Object.keys(fs);
        if (user !== 't4c') files = files.filter(f => f !== 'exploit.c' && f !== 'cv_modern.py');
        let out = files.join('   ');
        if (compiled && user === 't4c') out += '   exploit';
        return out;
    },
    'cat': (arg) => {
         if(!arg) return 'Usage: cat [filename]';
         if ((arg === 'exploit.c' || arg === 'cv_modern.py') && user !== 't4c') return 'cat: permission denied';
         return fs[arg] ? fs[arg] : `cat: ${arg}: No such file or directory`;
    },
    'more': (arg) => {
         if(!arg) return 'Usage: more [filename]';
         if ((arg === 'exploit.c' || arg === 'cv_modern.py') && user !== 't4c') return 'more: permission denied';
         return fs[arg] ? fs[arg] : `more: ${arg}: No such file or directory`;
    },
    'sudo': () => {
        if(user === 't4c') return 'root is allowed to do everything.';
        return `${user} is not in the sudoers file. This incident will be reported.`;
    },
    'df': () => {
        return `Filesystem     1K-blocks      Used Available Use% Mounted on
udev             8106268         0   8106268   0% /dev
tmpfs            1628048      1632   1626416   1% /run
/dev/sda1      479151840  42138116 412602740  10% /
tmpfs            8140232         0   8140232   0% /dev/shm
tmpfs               5120         4      5116   1% /run/lock
/dev/sda15        106858      6184    100674   6% /boot/efi
tmpfs            1628044        72   1627972   1% /run/user/1000`;
    },
    'mount': () => {
        return `sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
udev on /dev type devtmpfs (rw,nosuid,relatime,size=8106268k,nr_inodes=2026567,mode=755)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=1628048k,mode=755)
/dev/sda1 on / type ext4 (rw,relatime,errors=remount-ro)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k)
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
efivarfs on /sys/firmware/efi/efivars type efivarfs (rw,nosuid,nodev,noexec,relatime)
/dev/sda15 on /boot/efi type vfat (rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,utf8,errors=remount-ro)`;
    },
    'du': () => {
        let size = 0;
        Object.values(fs).forEach(c => size += c.length);
        return `${size}\t.`;
    },
    'ss': () => {
        return `State    Recv-Q   Send-Q     Local Address:Port      Peer Address:Port   Process
LISTEN   0        128              0.0.0.0:22             0.0.0.0:*
LISTEN   0        4096             0.0.0.0:80             0.0.0.0:*
LISTEN   0        4096             0.0.0.0:443            0.0.0.0:*
ESTAB    0        0          192.168.1.100:22        203.0.113.42:51234`;
    },
    'netstat': () => {
        return `Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:* LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:* LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:* LISTEN
tcp        0      0 192.168.1.100:22        203.0.113.42:51234      ESTABLISHED`;
    },
    'nmap': (arg) => {
        if (!arg) return 'Usage: nmap [target]';
        
        const args = arg.split(' ');
        const target = args[args.length - 1]; 

        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d} ${h}:${min} CET`;

        print(`Starting Nmap 7.80 ( https://nmap.org ) at ${dateStr}`, false);
        
        if (cmdLine) cmdLine.style.display = 'none';

        const delay = Math.floor(Math.random() * 5001) + 3000;

        setTimeout(() => {
            const duration = (delay / 1000 + 0.09).toFixed(2);
            const result = `Nmap scan report for ${target}
Host is up (0.024s latency).
Not shown: 65517 closed ports
PORT     STATE    SERVICE
22/tcp   open     ssh
25/tcp   open     smtp
80/tcp   open     http
110/tcp  open     pop3
111/tcp  filtered rpcbind
123/tcp  filtered ntp
135/tcp  filtered msrpc
137/tcp  filtered netbios-ns
138/tcp  filtered netbios-dgm
139/tcp  filtered netbios-ssn
143/tcp  open     imap
161/tcp  filtered snmp
443/tcp  open     https
445/tcp  filtered microsoft-ds
465/tcp  open     smtps
587/tcp  open     submission
993/tcp  open     imaps
995/tcp  open     pop3s
4190/tcp open     sieve

Nmap done: 1 IP address (1 host up) scanned in ${duration} seconds`;

            print(result, false);
            
            if (cmdLine) cmdLine.style.display = 'flex';
            input.focus();
            document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;

        }, delay);

        return null; 
    },
    'rm': (arg) => {
        if (arg.trim() === '-rf /' || arg.trim() === '-rf /*') {
            
            if (cmdLine) cmdLine.style.display = 'none';
            
            const fakeFiles = [
                'rm: cannot remove \'/boot/efi\': Device or resource busy',
                'removed \'/bin/bash\'',
                'removed \'/etc/shadow\'',
                'removed \'/etc/passwd\'',
                'removed \'/usr/lib/os-release\'',
                'removed \'/var/log/syslog\'',
                'removed \'/home/t4c/porn_collection\'',
                'removed \'/tmp/sess_8973498\'',
                'removed \'/lib64/ld-linux-x86-64.so.2\'',
                'removed \'/vmlinuz\''
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i >= fakeFiles.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        const trollMsg = '<br><span style="color: #ff3333; font-weight: bold; font-size: 16px;">nene hier löscht Du gar nix v^v oO v^v</span><br>';
                        print(trollMsg);
                        
                        if (cmdLine) cmdLine.style.display = 'flex';
                        input.disabled = false;
                        input.focus();
                        document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
                    }, 800);
                } else {
                    print(fakeFiles[i], false);
                    document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
                    i++;
                }
            }, 100);
            return null;
        }
        return `rm: cannot remove '${arg}': Permission denied`;
    },
    'help': () => 'COMMANDS: ls, cat [file], more [file], history, nmap [target], lynx [url], mount, df, du, ss, netstat, clear, whoami, exit' + (user === 't4c' ? ', rm, gcc, python, ./exploit' : ''),
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
            pSpan.textContent = 'guest@ghcif:~$';
            return 'logout';
        }
        location.reload(); 
        return 'logout';
    },
    'lynx': (arg) => {
        if (!arg) return 'Usage: lynx [url]';
        
        print(`Looking up ${arg}...`, false);
        print(`Making HTTPS connection to ${arg}...`, false);
        
        if (cmdLine) cmdLine.style.display = 'none';

        setTimeout(() => {
            if (arg === 'ghcif.de' || arg === 'www.ghcif.de' || arg === 'https://ghcif.de') {
                window.location.href = './index_old.html';
            } else {
                let target = arg;
                if (!target.startsWith('http')) target = 'https://' + target;
                window.location.href = target;
            }
        }, 3000);

        return null;
    },
    'gcc': (arg) => {
        if(user !== 't4c') return 'gcc: permission denied';
        if(arg === '-o exploit exploit.c') {
            compiled = true;
            return 'gcc: checking exploit.c... OK\ngcc: compiling... OK\ngcc: linking... OK';
        }
        return 'gcc: fatal error: no input files';
    },
    './exploit': () => {
        if(!compiled || user !== 't4c') return 'bash: ./exploit: No such file or directory';
        return 'Injecting payload... \nSUCCESS. \n\n (Nothing happened, but you looked cool doing it.)';
    },
    'python': (arg) => runPython(arg),
    'python3': (arg) => runPython(arg)
};

function runPython(arg) {
    if(user !== 't4c') return 'python: permission denied';
    if(arg === 'cv_modern.py') {
        return `[+] Loading modules... OK
[+] Reading user data from brain... OK
[+] Generating layout... OK
[+] Writing PDF... OK
<br>
Output generated: <a href="https://github.com/t4c/curriculum_vitae/releases/download/v2025.12/Milan_Berger_CV.pdf" target="_blank" style="color: #fff; font-weight:bold;">[ DOWNLOAD CV.PDF ]</a>`;
    }
    return `python: can't open file '${arg}': [Errno 2] No such file or directory`;
}

input.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value;
        const parts = val.split(' ');
        let availableFiles = Object.keys(fs);
        if(user !== 't4c') availableFiles = availableFiles.filter(f => f !== 'exploit.c' && f !== 'cv_modern.py');
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
                pSpan.textContent = 'guest@ghcif:~$';
                updateVisuals();
            }
            
            if(user === 't4c') pSpan.textContent = 't4c@ghcif:~#';
            
            pwdMode = false;
            input.value = '';
            document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
            return;
        }

        if(val) cmdHistory.push(val);
        histIndex = -1;
        
        print(`${pSpan.textContent} ${raw}`, true);

        const [cmd, ...args] = val.split(' ');
        if (cmds[cmd]) {
            const res = cmds[cmd](args.join(' '));
            if (res) print(res);
        } else if (val !== '') {
            print(`bash: ${cmd}: command not found`);
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
