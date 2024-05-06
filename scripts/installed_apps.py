from thefuzz import process, fuzz
import subprocess
import shlex
import argparse

# check for cl args
parser = argparse.ArgumentParser("installed_apps")
parser.add_argument("search_query", help="the app being searched for", type=str)
args = parser.parse_args()

# apps_dir = "/usr/share/applications"
# find_gui_apps = f"find {apps_dir} -name '*.desktop' -printf '%f\\n'"
find_desktop_apps_cmd = 'dpkg --search "*.desktop"'
desktop_apps = subprocess.run(shlex.split(find_desktop_apps_cmd), capture_output=True, encoding='utf-8')
awk_proc_cmd = 'awk "{print $1}"'
awk_proc = subprocess.run(shlex.split(awk_proc_cmd), input=desktop_apps.stdout, capture_output=True, encoding='utf-8')
sed_proc_cmd = 'sed "s/://"'
sed_proc = subprocess.run(shlex.split(sed_proc_cmd), input=awk_proc.stdout, capture_output=True, encoding='utf-8')
unique_only_cmd = 'sort --unique'
unique_only = subprocess.run(shlex.split(sed_proc_cmd), input=sed_proc.stdout, capture_output=True, encoding='utf-8')

# check for stderr
if not unique_only.stderr in [None, ""]:
    raise FileNotFoundError("not found any installed apps")

# store installed apps in list
installed_apps = [app for app in unique_only.stdout.split("\n") if app]

# fuzzy search on this list
sim_sorted_apps = process.extract(args.search_query, installed_apps)
for app, score in sim_sorted_apps:
    print(f"{app}: {score}")
