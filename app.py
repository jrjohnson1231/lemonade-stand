from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

weatherFactor = 0
day = 1
weather = ""
chanceOfRain = 0
weatherFactor = 1
weatherReport = ""
streetCrewThirsty = False
stormBrewing = False
specialDesc = ""
explanation = ""
startingPricePerGlass = 2
totalDays = 30
c9Constant = .5
adBenefit = 0
glassesSold = 0

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/submitted', methods=['POST'])
def submitted():
	data = request.get_data().decode(encoding='UTF-8')
	data = json.loads(data)
	currentPricePerGlass = data["price"]
	signsMade = data["signs"]
	glassesMade = data["cups"]	
	day = day + 1
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
		weatherReport = "sunny"
	elif(weather == "cloudy"):
		weatherReport = "Cloudy\n" + "There is a " + chanceOfRain + "% chance of light rain, and the weather is cooler today"
	elif(weather == "hot"):
		weatherReport = "Hot and Dry\n A heat wave is predicted for today!"
	elif(weather == "stormy"):
		weatherReport = "Thunderstorms!\nA severe thunderstorm hit Lemonsville earlier today, just as the lemonade stands were being set up. Unfortunately, everything was ruined!"
	streetCrewThirsty = False
	stormBrewing = False
	if(weather == "cloudy"):
		if(random.random() < .25):
			stormBrewing = true
	elif(weather == "hot"):
		continue
	else:
		if(random.random() < .25):
			specialDesc = "The street department is working today. There will be no traffic on your street"
			if(random.random() < .25):
				streetCrewThirsty = true
			else:
				weatherFactor = .1
	if(day < 3):
		currentPricePerGlass = 2
	elif(day < 7):
		currentPricePerGlass = 4
		if(day == 3):
			explanation = "(Your mother quit giving you free sugar.)"
	else:
		if(day == 7):
			explanation = "(The price of lemonade mix just went up.)"
		currentPricePerGlass = 5
	if(pricePlayerIsCharging >= startingPricePerGlass):
		number1 = ((math.pow(startingPricePerGlass, 2) * totalDays) / (math.pow(pricePlayerIsCharging, 2)))
	else:
		number1 = ((startingPricePerGlass - pricePlayerIsCharging) / (startingPricePerGlass * .8 * totalDays + totalDays))
	w = -signsMade * c9Constant
	adBenefit = (1 - (math.exp(w) * totalDays))
	number2 = math.floor(weatherFactor * number1 * (1+ adBenefit))
	if(stormBrewing):
		weather = stormy
		number2 = 0
		if(glassesMade > 0):
			specialResult = "All lemonade was ruined"
	elif(streetCrewThirsty):
		specialResult = "The street crews bought all your lemonade at lunchtime!"
	if(number2 < glassesMade):
		glassesSold = number2
	else:
		glassesSold = glassesMade
	expenses = glassesMade * (currentPricePerGlass/100) + signsMade * signCost
	income = glassesSold * pricePlayerIsCharging / 100
	profit = income - expenses
	assets = assets + income - expenses
	return jsonify({'assets': assets, 'income': income, 'profit': profit, 'expenses': expenses, 'explanation': explanation, 'weatherReport': weatherReport, 'specialDesc': specialDesc, 'specialResult': specialResult})

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')


