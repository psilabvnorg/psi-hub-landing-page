import { Link } from 'react-router-dom';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { useProducts } from '@/hooks/useProducts';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PhLogo } from '@/components/PhLogo';

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 bg-[#111] text-[#ffa31a] px-4 py-3 rounded-xl font-mono text-sm overflow-x-auto border border-[#2a2a2a] whitespace-pre">
      {children}
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
          →
        </div>
        <div className="flex-1">
          <h2 className="text-white text-xl font-bold">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
          {number}
        </div>
        <div className="flex-1">
          <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">Step {number}</p>
          <h2 className="text-white text-xl font-bold">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-14 p-4 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5">
      <p className="text-[#ffa31a] text-base font-bold mb-1">⚠ Note</p>
      <div className="text-white text-base">{children}</div>
    </div>
  );
}

export function OpenClawSetup() {
  const { config } = useProducts();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1b1b1b]">

        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
            >
              <PhLogo prefix="Psi" suffix="Hub" size="md" showImage />
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <PhLogo prefix="Content" suffix="Hub" size="md" />
            <span className="text-[#666] text-sm">/</span>
            <span className="text-[#ffa31a] text-sm font-bold">OpenClaw Setup</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12 text-center">
            <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
            <h1 className="text-white text-3xl font-bold mb-3">OpenClaw Setup Guide</h1>
            <p className="text-[#aaa] text-base">
              OpenClaw is an AI gateway that connects your Telegram bot to PSI features. It runs inside WSL (Windows Subsystem for Linux) on your Windows machine and must be <strong className="text-white">installed manually</strong> before the PSI app can use it.
            </p>
          </div>

          <div className="flex flex-col gap-12">

            {/* What you can do */}
            <Section title="What You Can Do via Telegram">
              <div className="mt-3 rounded-xl overflow-hidden border border-[#2a2a2a]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#222]">
                      <th className="text-left px-4 py-3 text-[#ffa31a] font-bold">Request</th>
                      <th className="text-left px-4 py-3 text-[#ffa31a] font-bold">Example message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Download a video', 'download https://youtube.com/watch?v=xxx'],
                      ['Generate a news video', 'tạo video từ bài này https://vnexpress.net/...'],
                      ['Text to speech', 'đọc văn bản: Xin chào mọi người'],
                      ['Extract text from a photo', 'Send a photo + nhận dạng chữ'],
                      ['Auto-comment on Facebook', 'post "Hello!" on https://facebook.com/groups/xyz, 5 posts'],
                      ['Check system status', 'check status'],
                    ].map(([req, ex], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#1b1b1b]' : 'bg-[#1f1f1f]'}>
                        <td className="px-4 py-3 text-white">{req}</td>
                        <td className="px-4 py-3 text-[#ffa31a] font-mono text-xs">{ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Requirements */}
            <Section title="Requirements">
              <ul className="mt-3 flex flex-col gap-2">
                {[
                  'Windows 10 (build 19041+) or Windows 11',
                  'WSL2 with Ubuntu installed',
                  'Node.js 22 or later (inside Ubuntu)',
                ].map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-white">
                    <span className="text-[#ffa31a] mt-0.5">•</span>
                    {req}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-white">
                  <span className="text-[#ffa31a] mt-0.5">•</span>
                  An Anthropic API key — get one at{' '}
                  <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors ml-1">console.anthropic.com</a>
                </li>
                <li className="flex items-start gap-2 text-white">
                  <span className="text-[#ffa31a] mt-0.5">•</span>
                  A Telegram bot token — create one via{' '}
                  <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors ml-1">@BotFather</a>
                </li>
              </ul>
            </Section>

            {/* Step 1 */}
            <Step number={1} title="Enable WSL2 and Install Ubuntu">
              <p className="text-white text-base mt-1">
                Open <strong>PowerShell as Administrator</strong> and run:
              </p>
              <CodeBlock>wsl --install</CodeBlock>
              <p className="text-white text-base mt-3">
                This installs WSL2 and Ubuntu automatically. Restart your computer when prompted, then open <strong>Ubuntu</strong> from the Start menu and complete the Linux user setup (username and password).
              </p>
              <p className="text-white text-base mt-3">To verify WSL2 is active:</p>
              <CodeBlock>wsl --status</CodeBlock>
            </Step>
            <Note>If WSL2 with Ubuntu is already installed, skip to Step 2.</Note>

            {/* Step 2 */}
            <Step number={2} title="Install Node.js inside Ubuntu">
              <p className="text-white text-base mt-1">Open the Ubuntu terminal and run:</p>
              <CodeBlock>{`curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt-get install -y nodejs
node -v   # should print v24.x.x or higher`}</CodeBlock>
            </Step>

            {/* Step 3 */}
            <Step number={3} title="Install OpenClaw">
              <p className="text-white text-base mt-1">Still inside the Ubuntu terminal:</p>
              <CodeBlock>{`sudo npm install -g openclaw@2026.4.9
openclaw --version   # confirm installation`}</CodeBlock>
            </Step>

            {/* Step 4 */}
            <Step number={4} title="Create a Telegram Bot">
              <ol className="mt-3 flex flex-col gap-2 text-white list-decimal list-inside">
                <li>Open Telegram and search for <strong>@BotFather</strong></li>
                <li>Send <code className="bg-[#111] text-[#ffa31a] px-1.5 py-0.5 rounded font-mono text-sm">/newbot</code> and follow the prompts</li>
                <li>
                  BotFather replies with a token in the format:
                  <CodeBlock>7xxxxxxxxxx:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</CodeBlock>
                </li>
                <li>Save this token — you will enter it in the PSI app Settings</li>
              </ol>
              <p className="text-white text-base mt-3">
                To find your own Telegram user ID (needed for the allowed-users list), message{' '}
                <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors">@userinfobot</a>.
              </p>
            </Step>

            {/* Step 5 */}
            <Step number={5} title="Configure PSI Settings">
              <p className="text-white text-base mt-1">
                Launch the <strong>PSI AI Content Hub</strong> app, go to <strong>Settings → OpenClaw</strong>, and fill in:
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {[
                  ['Anthropic API key', 'from console.anthropic.com'],
                  ['Telegram bot token', 'from @BotFather'],
                  ['Allowed Telegram user IDs', 'comma-separated IDs of users who can send commands'],
                ].map(([label, detail], i) => (
                  <li key={i} className="flex items-start gap-2 text-white">
                    <span className="text-[#ffa31a] mt-0.5">•</span>
                    <span><strong>{label}</strong> — {detail}</span>
                  </li>
                ))}
              </ul>
              <p className="text-white text-base mt-3">
                Click <strong>Save</strong>, then start the OpenClaw gateway from the Settings panel.
              </p>
            </Step>
            <Note>
              Credentials are stored locally at <code className="bg-[#111] text-[#ffa31a] px-1.5 py-0.5 rounded font-mono text-xs">%APPDATA%\psi-ai-content-hub\</code> and never sent to any external service by the app. They are passed to OpenClaw at runtime only.
            </Note>

            {/* Sending Commands */}
            <Section title="Sending Commands">
              <ul className="mt-3 flex flex-col gap-2 text-white">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffa31a] mt-0.5">•</span>
                  <span><strong>Private chat:</strong> type the command directly to your bot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffa31a] mt-0.5">•</span>
                  <span><strong>Group chat:</strong> mention the bot — <code className="bg-[#111] text-[#ffa31a] px-1.5 py-0.5 rounded font-mono text-sm">@YourBotName download https://...</code></span>
                </li>
              </ul>
              <p className="text-white text-base mt-3">
                The bot replies immediately to confirm, then sends the result as a follow-up message when ready. Some tasks (video generation, OCR, Facebook comments) run in the background and may take 1–5 minutes.
              </p>
            </Section>

            {/* Troubleshooting */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">?</div>
                <h2 className="text-white text-xl font-bold mt-2">Troubleshooting</h2>
              </div>
              <div className="ml-14 flex flex-col gap-6">
                {[
                  {
                    title: 'Bot does not respond',
                    items: [
                      'Check the PSI app is running and the OpenClaw status indicator is green in Settings',
                      'Confirm your Telegram user ID is in the Allowed IDs list',
                    ],
                  },
                  {
                    title: 'OpenClaw gateway fails to start',
                    items: [
                      'Open Ubuntu and confirm openclaw --version works',
                      'Confirm node -v shows ≥ 22',
                      'Restart the PSI app after fixing',
                    ],
                    code: undefined,
                  },
                  {
                    title: 'OCR says model not installed',
                    items: ['Open PSI Settings → Models → download the DeepSeek-OCR model (~2 GB)'],
                  },
                  {
                    title: '"Not logged in to Facebook"',
                    items: ['Open PSI Settings → Facebook → log in via the browser window, or import cookies'],
                  },
                ].map(({ title, items }, i) => (
                  <div key={i}>
                    <p className="text-[#ffa31a] font-bold text-base mb-2">{title}</p>
                    <ul className="flex flex-col gap-1">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-white text-sm">
                          <span className="text-[#ffa31a] mt-0.5">–</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <p className="text-[#ffa31a] font-bold text-base mb-2">Re-install OpenClaw</p>
                  <CodeBlock>sudo npm install -g openclaw@2026.4.9 --force</CodeBlock>
                  <p className="text-white text-sm mt-2">Then restart the PSI app.</p>
                </div>

                <div>
                  <p className="text-[#ffa31a] font-bold text-base mb-2">WSL2 not detected after enabling</p>
                  <ul className="flex flex-col gap-1">
                    <li className="flex items-start gap-2 text-white text-sm">
                      <span className="text-[#ffa31a] mt-0.5">–</span>
                      Ensure the machine was rebooted after <code className="bg-[#111] text-[#ffa31a] px-1 rounded font-mono text-xs">wsl --install</code>
                    </li>
                    <li className="flex items-start gap-2 text-white text-sm">
                      <span className="text-[#ffa31a] mt-0.5">–</span>
                      Check that virtualization is enabled in BIOS (required for WSL2)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
    </LanguageProvider>
  );
}
