import argparse
import subprocess
import shlex
from desktop_actions import DesktopAction
from pathlib import Path

# check for cl args
parser = argparse.ArgumentParser("open_app")
parser.add_argument("app_path", help="the app being opened", type=Path)
args = parser.parse_args()

action = DesktopAction(args.app_path)
installed_apps_cmd = subprocess.run(shlex.split(action.get_exec()), capture_output=True, encoding='utf-8')

if not installed_apps_cmd.stderr in [None, ""]:
    raise FileNotFoundError("not found any installed apps")