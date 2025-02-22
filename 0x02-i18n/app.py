#!/usr/bin/env python3
"""Flask app with localization and timezone handling."""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz


class Config(object):
    """Configuration for the app's languages, locale,
    and timezone settings."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


@babel.timezoneselector
def get_timezone() -> str:
    """Select the user's timezone based on request or user settings."""
    try:
        if request.args.get("timezone"):
            return pytz.timezone(request.args.get("timezone")).zone
        if g.user and g.user.get("timezone"):
            return pytz.timezone(g.user["timezone"]).zone
    except pytz.exceptions.UnknownTimeZoneError:
        pass
    return "UTC"


def get_user() -> dict:
    """Get the user information from query parameters."""
    user_id = request.args.get("login_as")
    if user_id and int(user_id) in users:
        return users[int(user_id)]
    return None


@app.before_request
def before_request() -> None:
    """Store the user in the global `g` object before each request."""
    g.user = get_user()


@babel.localeselector
def get_locale() -> str:
    """Determine the best language to use based
    on the request or user settings."""
    if request.args.get("locale") in app.config["LANGUAGES"]:
        return request.args.get("locale")
    if g.user and g.user.get("locale") in app.config["LANGUAGES"]:
        return g.user["locale"]
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/")
def index() -> str:
    """Render the homepage with the current time."""
    from datetime import datetime
    from flask_babel import format_datetime

    current_time = format_datetime(datetime.utcnow())
    return render_template("index.html", current_time=current_time)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
