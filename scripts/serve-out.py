"""Serve the static export in out/ for local preview, with caching disabled.

Python's plain `http.server` sends no cache headers, so browsers reuse an old
index.html after a rebuild and you end up looking at stale code.
Usage: python3 scripts/serve-out.py [port]
"""

import functools
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
handler = functools.partial(NoCacheHandler, directory="out")
print(f"Serving out/ at http://127.0.0.1:{port} (no-cache)")
http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
