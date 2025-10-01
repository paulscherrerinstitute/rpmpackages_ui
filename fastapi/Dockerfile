FROM python:alpine

WORKDIR /app

RUN addgroup -S rpmpackages && adduser -S -D -H -s /sbin/nologin -G rpmpackages rpmpackages

RUN apk add --update --no-cache --virtual .tmp pkgconfig hdf5-dev gcc libc-dev linux-headers curl mongodb-tools

RUN curl -L https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"

COPY requirements.txt .

RUN uv pip install -r requirements.txt --system --no-cache

COPY main.py .
COPY shared_resources/ shared_resources/
COPY routers/ routers/
RUN chown -R databoard:databoard /app

EXPOSE 8080

USER databoard

CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8080"]