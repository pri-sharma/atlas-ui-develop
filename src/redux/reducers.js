import Auth from './auth/reducer';
import App from './app/reducer';
import CPAssignment from './app/reducers/cpassignmentReducer.js';
import CUAssignment from './cuassignment/reducer';
import SalesOrg from './salesorg/reducer';
import Event from './events/reducer';
import CustomerGroup from './customerGroups/reducer';
import Bvp from './bvp/reducer';
import PlannableCustomers from './plannableCustomers/reducer';
import News from './news/reducers';
import SalesOrgDefaults from './salesorgDefaults/reducers';
import Attributes from './attributes/reducers';
import UserSettings from './userSettings/reducers';
import Assortments from './assortment/reducers';
import GridView from './reporting/reducers';//MA Changes

export default {
  Auth,
  App,
  CPAssignment,
  SalesOrg,
  CUAssignment,
  Event,
  CustomerGroup,
  Bvp,
  PlannableCustomers,
  News,
  SalesOrgDefaults,
  Attributes,
  UserSettings,
  Assortments,
  GridView //MA Changes
};
