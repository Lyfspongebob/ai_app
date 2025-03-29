#该文件是测试数据库连接的文件
import pymysql

try:
    connection = pymysql.connect(
        host='your_sql_host',
        user='user_name',
        password='password',
        port=3306,
        database='db_name'
    )
    print("Connection successful!")
    connection.close()
except pymysql.MySQLError as e:
    print(f"Error: {e}")
