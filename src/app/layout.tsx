import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a4b32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "EduNova — Digital Campus Platform",
    template: "%s | EduNova",
  },
  description:
    "EduNova is an enterprise digital campus platform empowering institutional excellence, academic operations, student success, and administration.",
  keywords: [
    "EduNova",
    "Digital Campus",
    "Institutional Management",
    "Polytechnic",
    "Academic Management",
    "Student Portal",
    "Faculty Portal",
  ],
  authors: [{ name: "Md Salman Hossain" }],
  openGraph: {
    title: "EduNova — Digital Campus Platform",
    description:
      "Enterprise digital campus platform empowering institutional excellence and academic operations.",
    type: "website",
    locale: "en_US",
    siteName: "EduNova Digital Campus",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Suppress Next.js dev overlay for browser extension artifacts like bis_skin_checked
                  var origError = console.error;
                  console.error = function() {
                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (typeof arg === 'string' && (arg.indexOf('bis_skin_checked') !== -1 || (arg.indexOf('hydrated but some attributes') !== -1 && arguments[i + 1] && String(arguments[i + 1]).indexOf('bis_skin_checked') !== -1))) {
                        return;
                      }
                      if (arg && typeof arg === 'object' && JSON.stringify(arg).indexOf('bis_skin_checked') !== -1) {
                        return;
                      }
                    }
                    return origError.apply(console, arguments);
                  };

                  var origWarn = console.warn;
                  console.warn = function() {
                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (typeof arg === 'string' && arg.indexOf('bis_skin_checked') !== -1) {
                        return;
                      }
                    }
                    return origWarn.apply(console, arguments);
                  };

                  var clean = function(el) {
                    if (el && el.removeAttribute && el.hasAttribute && el.hasAttribute('bis_skin_checked')) {
                      el.removeAttribute('bis_skin_checked');
                    }
                  };
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        clean(m.target);
                      }
                      if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          var node = m.addedNodes[j];
                          if (node.nodeType === 1) {
                            clean(node);
                            if (node.querySelectorAll) {
                              var inner = node.querySelectorAll('[bis_skin_checked]');
                              for (var k = 0; k < inner.length; k++) {
                                clean(inner[k]);
                              }
                            }
                          }
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
