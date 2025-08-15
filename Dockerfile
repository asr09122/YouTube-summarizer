# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code (excluding files in .dockerignore)
COPY . .

# Expose the port (Render will override this)
ARG PORT
ENV PORT=${PORT:-5000}
EXPOSE ${PORT}

# Healthcheck (optional, but recommended for Render)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1

# Command to run your app (ensure it runs on 0.0.0.0 and correct port)
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT} app:app"]
