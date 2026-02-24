import os
from googletrans import Translator, LANGUAGES
from langdetect import detect, DetectorFactory
import logging

DetectorFactory.seed = 0
translator = Translator()
logger = logging.getLogger(__name__)

LANGUAGE_MAP = {
    "am": "Amharic",
    "or": "Oromo", 
    "en": "English",
    "fr": "French"
}

def detect_language(text: str) -> str:
    """Detect the language of input text."""
    try:
        lang_code = detect(text)
        return lang_code if lang_code in LANGUAGE_MAP else "en"
    except Exception as e:
        logger.error(f"Language detection error: {e}")
        return "en"

def translate_to_english(text: str, source_lang: str = None) -> tuple[str, str]:
    """Translate text to English if needed."""
    if source_lang is None:
        source_lang = detect_language(text)
    
    if source_lang == "en":
        return text, "en"
    
    try:
        translation = translator.translate(text, src_language=source_lang, dest_language="en")
        return translation.text, source_lang
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text, source_lang

def translate_from_english(text: str, target_lang: str) -> str:
    """Translate English text to target language."""
    if target_lang == "en":
        return text
    
    try:
        translation = translator.translate(text, src_language="en", dest_language=target_lang)
        return translation.text
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text
