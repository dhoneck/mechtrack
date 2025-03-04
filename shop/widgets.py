from django import forms
import json

class PrettyJSONWidget(forms.Textarea):
    def format_value(self, value):
        try:
            # Pretty-print the JSON data
            value = json.dumps(json.loads(value), indent=4, sort_keys=True)
        except (TypeError, ValueError):
            pass
        return value