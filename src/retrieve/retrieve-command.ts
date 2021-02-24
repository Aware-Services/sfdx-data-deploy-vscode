import { window } from 'vscode';
import readDescriptor from '../utils/read-descriptor';
import selectDataFiles from '../utils/select-data-files';
import selectDeployDirectory from '../utils/select-deploy-directory';

export default async function retrieveCommand(
  deployDir?: string,
  include?: string[]
): Promise<void> {
      const deployDirectory = deployDir || ((_a = (yield select_deploy_directory_1.default())) === null || _a === void 0 ? void 0 : _a.detail);
      if (!deployDirectory) {
          return;
      }
  
      let descriptor;
      let target;
  
      try {
          descriptor = yield read_descriptor_1.default(deployDirectory);
          target = descriptor.targets.retrieve;
      }
      catch (error) {
          vscode_1.window.showErrorMessage(error.message);
          return;
      }
      
      const includeFiles = include || (yield select_data_files_1.default(descriptor));
      
      if (!includeFiles) {
          return;
      }
      const terminal = vscode_1.window.createTerminal('SFDX Data Retrieve');
      terminal.show(true);
      if (includeFiles.length > 0) {
          const includeParam = includeFiles.join(',');
          terminal.sendText(`sfdx datadeploy:retrieve -d "${deployDirectory}" -i "${includeParam}" -u "${target}"`);
      }
      else {
          terminal.sendText(`sfdx datadeploy:retrieve -d "${deployDirectory}" -u "${target}"`);
      }
  }
