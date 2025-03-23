#!/usr/bin/env python3
"""
Simple HTTP server for testing the FilterTable library.
Run this script from the filter-table directory to serve the files.
"""

import http.server
import socketserver
import os
import sys

# Default port
PORT = 8000

# Check if a port was specified as a command-line argument
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"Invalid port: {sys.argv[1]}")
        print(f"Using default port: {PORT}")

# Set up the handler to serve files from the current directory
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
})

# Create the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    # Serve until interrupted
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
