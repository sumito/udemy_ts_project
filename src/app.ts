

import {PropjectInput} from './components/project-input.js';
import {ProjectList} from './components/project-list.js';
import {ProjectStatus} from './models/project.js';

new PropjectInput();
new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);    
