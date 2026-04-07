FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY .streamlit/ ./.streamlit/
COPY app.py .
COPY pages/ ./pages/
CMD ["streamlit", "run", "app.py"]
