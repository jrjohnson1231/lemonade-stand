from flask import Flask, render_template, jsonify, request
import json
import random
import math

app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/initialize', methods=['POST'])
def initialize():
        weatherFactor = 0
	weather = ""
	chanceOfRain = 0
	weatherReport = ""
	streetCrewThirsty = False
	specialDesc = ""
	specialDescIndicator = False
	explanation = ""
	explanationIndicator = False

	data = request.get_data().decode(encoding='UTF-8')
	data = json.loads(data)
	day = data['day']

	specialDescIndicator = False
	explanationIndicator = False
	r = random.random()
	if(r < .6):
		weather = "sunny"
	elif(r < .8):
		weather = "cloudy"
	else:
		if(day < 3):
			weather = "sunny"
		else:
			weather = "hot"

	chanceOfRain = 0
	if(weather == "cloudy"):
		chanceOfRain = 30 + math.floor(random.random() * 5) * 10
		weatherFactor = 1 - chanceOfRain / 100
	elif(weather == "hot"):
		weatherFactor = 2
	else:
		weatherFactor = 1
	if(weather == "sunny"):
		weatherReport = "Sunny"
	elif(weather == "cloudy"):
		weatherReport = "Cloudy\n" + "There is a " + str(chanceOfRain) + "% chance of light rain, and the weather is cooler today"
	elif(weather == "hot"):
		weatherReport = "Hot and Dry\n A heat wave is predicted for today!"

	streetCrewThirsty = False
	stormBrewing = False
	if(weather == "cloudy"):
		if(random.random() < .25):
			stormBrewing = True
	else:
		if(random.random() < .25):
			specialDesc = "The street department is working today. There will be no traffic on your street"
			specialDescIndicator = True
			if(random.random() < .25):
				streetCrewThirsty = True
			else:
				weatherFactor = .1

	if(day < 3):
		currentPricePerGlass = .02
	elif(day < 7):
		currentPricePerGlass = .04
		if(day == 3):
			explanationIndicator = True
			explanation = "(Your mother quit giving you free sugar.)"
	else:
		if(day == 7):
			explanation = "(The price of lemonade mix just went up.)"
			explanationIndicator = True
		currentPricePerGlass = .05
	return jsonify(data={'weather': weather, 'currentPricePerGlass': currentPricePerGlass, 'explanation': explanation, 'explanationIndicator': explanationIndicator, 'specialDesc': specialDesc, 'specialDescIndicator': specialDescIndicator, 'weatherReport': weatherReport})


@app.route('/submitted', methods=['POST'])
def submitted():
	stormBrewing = False
	specialResult = ""
	specialResultIndicator = False
	startingPricePerGlass = 2
	totalDays = 30
	c9Constant = .5
	adBenefit = 0
	glassesSold = 0
	signCost = .15
	assets = 2
	weatherFactor = 0

	data = request.get_data().decode(encoding='UTF-8')
	data = json.loads(data)
	pricePlayerIsCharging = data["price"]
	signsMade = data["signs"]
	glassesMade = data["cups"]
	day = data['day']
	assets = data['assets']
        weather = data['weather']

	if(day < 3):
		currentPricePerGlass = .02
	elif(day < 7):
		currentPricePerGlass = .04
		if(day == 3):
			explanationIndicator = True
			explanation = "(Your mother quit giving you free sugar.)"
	else:
		if(day == 7):
			explanation = "(The price of lemonade mix just went up.)"
			explanationIndicator = True
		currentPricePerGlass = .05
	if(pricePlayerIsCharging >= startingPricePerGlass):
		number1 = ((math.pow(startingPricePerGlass, 2) * totalDays) / (math.pow(pricePlayerIsCharging, 2)))
	else:
		number1 = ((startingPricePerGlass - pricePlayerIsCharging) / (startingPricePerGlass * .8 * totalDays + totalDays))

	chanceOfRain = 0
	if(weather == "cloudy"):
		chanceOfRain = 30 + math.floor(random.random() * 5) * 10
		weatherFactor = 1 - chanceOfRain / 100
	elif(weather == "hot"):
		weatherFactor = 2
	else:
		weatherFactor = 1
	if(weather == "sunny"):
		weatherReport = "Sunny"
	elif(weather == "cloudy"):
		weatherReport = "Cloudy\n" + "There is a " + str(chanceOfRain) + "% chance of light rain, and the weather is cooler today"
	elif(weather == "hot"):
		weatherReport = "Hot and Dry\n A heat wave is predicted for today!"
	streetCrewThirsty = False
	stormBrewing = False
	if(weather == "cloudy"):
		if(random.random() < .25):
			stormBrewing = True
	else:
		if(random.random() < .25):
			specialDesc = "The street department is working today. There will be no traffic on your street"
			specialDescIndicator = True
			if(random.random() < .25):
				streetCrewThirsty = True
			else:
				weatherFactor = .1

	w = -signsMade * c9Constant
	adBenefit = (1 - (math.exp(w)))
	number2 = math.floor(weatherFactor * number1 * (1+ adBenefit))
	if(stormBrewing):
		number2 = 0
		if(glassesMade > 0):
			specialResult = "Thunderstorms!\nA severe thunderstorm hit Lemonsville earlier today, just as the lemonade stands were being set up. Unfortunately, all lemonade was ruined!"
			specialResultIndicator = True
	elif(streetCrewThirsty):
		specialResult = "The street crews bought all your lemonade at lunchtime!"
		specialResultIndicator = True
	if(number2 < glassesMade):
		glassesSold = number2
	else:
		glassesSold = glassesMade
		print 'Sold' + str(glassesSold) + 'glasses'
		print 'Ad Benefit' + str(adBenefit)
		print 'Current price per glass' + str(currentPricePerGlass)
	expenses = glassesMade * currentPricePerGlass + signsMade * signCost
	income = float(glassesSold) * float(pricePlayerIsCharging) / float(100)
	profit = income - expenses
	assets = assets + income - expenses
	return jsonify(data={'glassesSold': glassesSold, 'assets': assets, 'income': income, 'profit': profit, 'expenses': expenses, 'specialResult': specialResult, 'specialResultIndicator': specialResultIndicator})

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')


