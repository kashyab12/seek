from desktop_parser import DesktopFile
from pathlib import Path
import argparse
import subprocess
import shlex

# check for cl args
parser = argparse.ArgumentParser("open_app")
parser.add_argument("app_path", help="the app being opened", type=Path)
args = parser.parse_args()

# Parse file
desktop_file = DesktopFile.from_file(args.app_path)
app_exec_cmd = desktop_file.data["Exec"]
installed_apps_cmd = subprocess.run(shlex.split(app_exec_cmd), capture_output=True, encoding='utf-8')

if not installed_apps_cmd.stderr in [None, ""]:
    raise FileNotFoundError("not found any installed apps")