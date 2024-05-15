from thefuzz import process
import base64
import subprocess
import shlex
import argparse

def find_app_icon(app_desktop_path):
    try:
        icons_dir = "/usr/share/icons"
        app_icon_name_cmd = f"grep Icon {app_desktop_path}"
        icon_name_cmd_proc = subprocess.run(shlex.split(app_icon_name_cmd), capture_output=True, encoding='utf-8', check=True)
        icon_name = icon_name_cmd_proc.stdout.split("=")[-1].split("\n")[0]
        app_icon_path_cmd = f"find {icons_dir} -name '{icon_name}.*' -type f"
        app_icon_cmd_proc = subprocess.run(shlex.split(app_icon_path_cmd), capture_output=True, encoding='utf-8', check=True)
        return app_icon_cmd_proc.stdout
    except subprocess.CalledProcessError as cep:
        return ""

# check for cl args
parser = argparse.ArgumentParser("installed_apps")
parser.add_argument("search_query", help="the app being searched for", type=str)
args = parser.parse_args()

# find_gui_apps = f"find {apps_dir} -name '*.desktop' -printf '%f\\n'"
find_desktop_apps_cmd = 'dpkg --search "*.desktop"'
desktop_apps = subprocess.run(shlex.split(find_desktop_apps_cmd), capture_output=True, encoding='utf-8')
only_usr_share_apps_cmd = 'grep /usr/share/applications'
gui_apps = subprocess.run(shlex.split(only_usr_share_apps_cmd), input=desktop_apps.stdout, capture_output=True, encoding='utf-8')
unique_only_cmd = 'sort --unique'
unique_only = subprocess.run(shlex.split(unique_only_cmd), input=gui_apps.stdout, capture_output=True, encoding='utf-8')

# check for stderr
if not unique_only.stderr in [None, ""]:
    raise FileNotFoundError("not found any installed apps")

# store installed apps in list
apps_struct = {}
for app_by_path in unique_only.stdout.split("\n"):
    if app_by_path:
        app, desktop_path = app_by_path.split(": ")
        apps_struct[app] = {
            ".desktop": desktop_path
        }

# todo: seperate this into it's own script
sim_sorted_apps = process.extract(args.search_query, list(apps_struct.keys()))
for app, score in sim_sorted_apps:
    icon_paths = find_app_icon(apps_struct[app][".desktop"])
    icon_choose = icon_paths.split("\n")[0] if icon_paths else ""
    print(f"{app}: {score}; {icon_choose}")
