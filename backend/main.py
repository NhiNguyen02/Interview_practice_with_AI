from app import create_app
from app.database import check_connection
import os
import sys

app = create_app()

if __name__ == '__main__':
    if not check_connection():
        print('Could not connect to the database. Server shutting down.')
        sys.exit(1)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

# cloudflared tunnel --url http://localhost:5000