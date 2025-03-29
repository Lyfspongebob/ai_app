import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='Lyf2005@',
        port=3306,
        database='ai_assistant'
    )
    print("Connection successful!")
    connection.close()
except pymysql.MySQLError as e:
    print(f"Error: {e}")