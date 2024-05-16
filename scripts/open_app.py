import argparse
import subprocess
import shlex
import json
import os
from desktop_actions import DesktopAction
from pathlib import Path

# check for cl args
parser = argparse.ArgumentParser("open_app")
parser.add_argument("app_name", help="the app being opened", type=str)
parser.add_argument("installed_apps", help="where installed app info is serialized", type=str)
args = parser.parse_args()

# read installed apps
with open(args.installed_apps, "r") as json_file:
    apps = json.load(json_file)

if not apps[args.app_name]["exec"]:
    raise ValueError("no exec value found!")

print(apps[args.app_name]["exec"])

try:
    env_vars = os.environ.copy()
    env_vars["GTK_PATH"] = ""
    installed_apps_cmd = subprocess.run(shlex.split(apps[args.app_name]["exec"]), capture_output=True, check=True, encoding='utf-8', env=env_vars)
except subprocess.CalledProcessError as cpe:
    raise cpe