#!/usr/bin/env python3
"""
Simple HTTP server for testing the Enhanced Simple Table library.
Run this script from the filter-table directory to serve the files.
"""

import http.server
import socketserver
import os
import sys
import socket

# Function to check if a port is already in use
def is_port_in_use(port):
    """Check if the specified port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

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

# Check if server is already running on the specified port
if is_port_in_use(PORT):
    print(f"Server is already running at http://localhost:{PORT}")
else:
    # Create the server
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        
        # Serve until interrupted
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
