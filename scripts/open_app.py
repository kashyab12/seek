import argparse
import subprocess
import shlex
from desktop_actions import DesktopAction
from pathlib import Path

# check for cl args
parser = argparse.ArgumentParser("open_app")
parser.add_argument("app_path", help="the app being opened", type=Path)
args = parser.parse_args()

try:
    execute_app = f"/usr/bin/{args.app_path}"
    installed_apps_cmd = subprocess.run(shlex.split(execute_app), capture_output=True, encoding='utf-8', check=True)
except subprocess.CalledProcessError as cpe:
    raise cpe