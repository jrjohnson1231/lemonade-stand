from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/submitted', methods=['POST'])
def submitted():
	data = request.get_data().decode(encoding='UTF-8')
	print data
	return jsonify(data=data)

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')


