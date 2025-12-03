FROM python:3.12.4-alpine

WORKDIR /backend

COPY requirements.txt .
RUN python -m ensurepip --upgrade
RUN python -m pip install --upgrade setuptools

RUN pip install --no-cache-dir -r requirements.txt
RUN apk add mongodb-tools
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000","--proxy-headers","--forwarded-allow-ips=*"]
