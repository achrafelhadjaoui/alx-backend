#!/usr/bin/env python3
"""Flask application for demonstrating Babel
localization features."""

from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """Configuration for the Flask app, specifying supported
    languages and default locale settings."""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """
    Determine the best match for supported languages based
    on the client's request.
    Returns:
        str: The best matching language code from the supported languages.
    """
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/")
def index():
    """
    Render the index page.

    Returns:
        str: HTML content of the index page.
    """
    return render_template("2-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
