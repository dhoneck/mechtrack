from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import CustomUser, Business, Branch
from .widgets import PrettyJSONWidget

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ('business', 'email', 'first_name', 'last_name')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class CustomUserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = CustomUser
        fields = ('business', 'email', 'password', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser')

    def clean_password(self):
        return self.initial["password"]

class BusinessAdminForm(forms.ModelForm):
    class Meta:
        model = Business
        fields = '__all__'
        widgets = {
            'default_pricing': PrettyJSONWidget,
        }

class BranchAdminForm(forms.ModelForm):
    class Meta:
        model = Branch
        fields = '__all__'
        widgets = {
            'default_pricing': PrettyJSONWidget,
        }