import os
import re
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class RangeRequestHandler(SimpleHTTPRequestHandler):
    """
    Multi-threaded HTTP Request Handler with full Range (HTTP 206 Partial Content) support.
    Enables concurrent video and audio streaming for multiple users simultaneously.
    """
    
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        path = getattr(self, 'path', '')
        clean_path = path.split('?')[0].lower() if path else ''
        if any(clean_path.endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.mp3', '.mp4', '.woff2']):
            self.send_header('Cache-Control', 'public, max-age=86400')
        else:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_GET(self):
        range_header = self.headers.get('Range')
        if not range_header:
            return super().do_GET()

        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().do_GET()

        try:
            file_size = os.path.getsize(path)
            range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if range_match:
                first_byte = int(range_match.group(1))
                last_byte = int(range_match.group(2)) if range_match.group(2) else file_size - 1
            else:
                suffix_match = re.match(r'bytes=-(\d+)', range_header)
                if suffix_match:
                    length = int(suffix_match.group(1))
                    first_byte = max(0, file_size - length)
                    last_byte = file_size - 1
                else:
                    return super().do_GET()

            if first_byte >= file_size or last_byte >= file_size or first_byte > last_byte:
                self.send_error(416, 'Requested Range Not Satisfiable')
                self.send_header('Content-Range', f'bytes */{file_size}')
                self.end_headers()
                return

            length = last_byte - first_byte + 1

            self.send_response(206)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Content-Range', f'bytes {first_byte}-{last_byte}/{file_size}')
            self.send_header('Content-Length', str(length))
            self.end_headers()

            with open(path, 'rb') as f:
                f.seek(first_byte)
                remaining = length
                buf_size = 64 * 1024
                while remaining > 0:
                    read_size = min(buf_size, remaining)
                    data = f.read(read_size)
                    if not data:
                        break
                    try:
                        self.wfile.write(data)
                    except (ConnectionResetError, BrokenPipeError):
                        break
                    remaining -= len(data)
        except Exception as e:
            self.log_error("Range handling failed: %s", str(e))

def run(port=8000):
    server_address = ('0.0.0.0', port)
    httpd = ThreadingHTTPServer(server_address, RangeRequestHandler)
    print(f"CodeKala Multi-threaded Streaming Server running on http://localhost:{port}", flush=True)
    httpd.serve_forever()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run(port)
