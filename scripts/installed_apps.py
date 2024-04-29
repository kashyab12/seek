from thefuzz import process, fuzz
import subprocess
import shlex
import argparse

# check for cl args
parser = argparse.ArgumentParser("installed_apps")
parser.add_argument("search_query", help="the app being searched for", type=str)
args = parser.parse_args()

apps_dir = "/usr/share/applications"
find_gui_apps = f"find {apps_dir} -name '*.desktop' -printf '%f\\n'"
installed_apps_cmd = subprocess.run(shlex.split(find_gui_apps), capture_output=True, encoding='utf-8')

# check for stderr
if not installed_apps_cmd.stderr in [None, ""]:
    raise FileNotFoundError("not found any installed apps")

# store installed apps in list
installed_apps = [app for app in installed_apps_cmd.stdout.split("\n") if app]

# fuzzy search on this list
sim_sorted_apps = process.extract(args.search_query, installed_apps)
for app, score in sim_sorted_apps:
    print(f"{apps_dir}/{app}: {score}")