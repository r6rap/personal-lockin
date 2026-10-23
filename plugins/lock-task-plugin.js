const { withAndroidManifest, withMainApplication } = require("@expo/config-plugins");

module.exports = function withLockTask(config) {
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const usesPermissions = manifest["uses-permission"] || [];
    const hasPermission = usesPermissions.some(
      (permission) =>
        permission.$ && permission.$["android:name"] === "android.permission.REORDER_TASKS"
    );

    if (!hasPermission) {
      usesPermissions.push({
        $: {
          "android:name": "android.permission.REORDER_TASKS",
        },
      });
      manifest["uses-permission"] = usesPermissions;
    }

    const application = manifest.application && manifest.application[0];
    const activities = application && application.activity ? application.activity : [];
    const mainActivity = activities.find(
      (activity) => activity.$ && activity.$["android:name"] === ".MainActivity"
    );

    if (mainActivity) {
      mainActivity.$["android:lockTaskMode"] = "if_whitelisted";
      mainActivity.$["android:showWhenLocked"] = "true";
      mainActivity.$["android:turnScreenOn"] = "true";
    }

    return config;
  });

  return withMainApplication(config, (config) => {
    const contents = config.modResults.contents;

    if (!contents.includes("import com.lockinapp.LockTaskPackage;")) {
      config.modResults.contents = contents.replace(
        "import com.facebook.react.ReactPackage;",
        "import com.facebook.react.ReactPackage;\nimport com.lockinapp.LockTaskPackage;"
      );
    }

    if (!contents.includes("packages.add(new LockTaskPackage());")) {
      config.modResults.contents = contents.replace(
        "return packages;",
        "packages.add(new LockTaskPackage());\n\n    return packages;"
      );
    }

    return config;
  });
};
