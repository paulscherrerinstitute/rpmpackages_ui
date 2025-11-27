FROM python:alpine

WORKDIR /app

RUN apk add --update --no-cache --virtual .tmp curl
RUN addgroup -S rpm_ui && adduser -S rpm_backend -G rpm_ui

RUN curl -L https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"

COPY requirements.txt .

RUN uv pip install -r requirements.txt --system --no-cache

COPY main.py .

COPY routers/ routers/
COPY shared_resources/ shared_resources/

RUN chown -R rpm_backend:rpm_ui /app
USER rpm_backend

EXPOSE 8080

CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8080"]