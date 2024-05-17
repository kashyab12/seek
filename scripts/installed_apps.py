import subprocess
import shlex
import json
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
    
def desktop_exec_cmd(app_desktop_path):
    try:
        grep_exec_cmds = f"grep Exec {app_desktop_path}"
        grep_exec_proc = subprocess.run(shlex.split(grep_exec_cmds), capture_output=True, encoding='utf-8', check=True)
        # this should likely be the desktop entry exec cmd
        exec_cmds = grep_exec_proc.stdout.split("\n")
        not_file_execs = []
        for cmd in exec_cmds:
            if cmd and not any(wildcard in cmd.lower() for wildcard in ["%u", "%f"]):
                not_file_execs.append(cmd)
        if len(not_file_execs) == 0: return ""
        choose_first = not_file_execs[0].split("=")[-1]
        return choose_first
    except subprocess.CalledProcessError as cep:
        return ""

# check for cl args
parser = argparse.ArgumentParser("installed_apps")
parser.add_argument("save_dir", help="where installed app info is serialized", type=str)
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

# store installed apps info
apps_struct = {}
for app_by_path in unique_only.stdout.split("\n"):
    if app_by_path:
        app, desktop_path = app_by_path.split(": ")
        icon_paths = find_app_icon(desktop_path)
        icon_choose = icon_paths.split("\n")[0] if icon_paths else ""
        exec_cmd = desktop_exec_cmd(desktop_path)
        apps_struct[app] = {
            ".desktop": desktop_path,
            "icon_path": icon_choose,
            "exec": exec_cmd
        }

# serialize the info in the save_dir
with open(f"{args.save_dir}{'/' if args.save_dir[-1] != '/' else ''}installed_apps.json", "w") as json_out:
    json.dump(apps_struct, json_out, indent=4)

