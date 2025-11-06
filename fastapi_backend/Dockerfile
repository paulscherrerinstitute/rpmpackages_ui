FROM python:alpine

WORKDIR /app

RUN apk add --update --no-cache --virtual .tmp curl

RUN curl -L https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"

COPY requirements.txt .

RUN uv pip install -r requirements.txt --system --no-cache

COPY main.py .

COPY routers/ routers/
COPY shared_resources/ shared_resources/

EXPOSE 8080

CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8080"]