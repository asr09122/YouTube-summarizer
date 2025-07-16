# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code (excluding files in .dockerignore)
COPY . .

# Expose the port your app runs on (change if not 5000)
EXPOSE 5000

# Healthcheck (optional, but recommended for Render)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:5000/ || exit 1

# Command to run your app (ensure it runs on 0.0.0.0)
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"] 