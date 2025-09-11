from app import app, mysql

def apply_schema(schema_path: str) -> None:
    with open(schema_path, "r", encoding="utf-8") as f:
        sql_text = f.read()

    statements = [s.strip() for s in sql_text.split(";") if s.strip()]

    with app.app_context():
        cursor = mysql.connection.cursor()
        for statement in statements:
            try:
                cursor.execute(statement)
                mysql.connection.commit()
                print(f"✓ Executed: {statement[:50]}...")
            except Exception as e:
                print(f"✗ Error executing statement: {e}")
                print(f"Statement: {statement[:100]}...")

if __name__ == "__main__":
    apply_schema("schema.sql")
    print("Schema applied successfully!")
