import params from '../../config/params';
import models from '../../setup/models';

// Get all Preferences
export async function getAll() {
  return await models.Preference.findAll();
}

// Get preference by group
export async function getByGroup(parentValue, { group }) {
  return await models.Preference.findAll({
    where: {
      group
    }
  });
}

// Get preference by name
export async function getByName(parentValue, { name }) {
  return await models.Preference.findAll({
    where: {
      name
    }
  });
}

// Update preference
export async function update(parentValue, { id, value }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    return await models.Preference.update(
      {
        value
      },
      { where: { id } }
    );
  } else {
    throw new Error('Operation denied.');
  }
}
