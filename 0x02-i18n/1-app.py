#!/usr/bin/env python3
"""A simple Flask web application with Babel for
internationalization support."""

from flask import Flask, render_template
from flask_babel import Babel


class Config(object):
    """Configuration class for setting default language
    and timezone for the app."""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@app.route("/")
def index():
    """Render the home page with language support."""
    return render_template("1-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
