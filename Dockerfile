# ვიყენებთ პითონის მსუბუქ ვერსიას
FROM python:3.11-slim

# სამუშაო ფოლდერი კონტეინერში
WORKDIR /app

# ვაკოპირებთ საჭირო ბიბლიოთეკების სიას და ვაყენებთ
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ვაკოპირებთ დანარჩენ კოდს
COPY ./app ./app

# ვუთითებთ პორტს
EXPOSE 8000

# გაშვების ბრძანება
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]