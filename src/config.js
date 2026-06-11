const preprod = {
  networkName: "preprod",
  defaultAdaptor: "Ferret",
  defaultConnector: "Ferret",
  maxRollbackLength: 2160,
  scriptDeploymentAddress: "addr_test1vrpynvza5vswczszkjhe5cvqz2awmzukf84xa5wway8durqpmfm2m",
  konduitValidatorAddress: "addr_test1wrpc0agp7ce78zefuk38kyza8rnu3gzy9vy6ynhh7t9ygygy5fd4h",
  adaptors: [
    {
      label: "Ferret",
      url: "https://preprod-adaptor.ferret.channel",
    },
  ],
  connectors: [
    {
      label: "Ferret",
      url: "https://preprod-cardano.ferret.channel",
    },
  ],
};

const mainnet = {
  networkName: "mainnet",
  defaultAdaptor: "Ferret",
  defaultConnector: "Ferret",
  maxRollbackLength: 2160,
  scriptDeploymentAddress: "addr1qyvf5xgy6kn78mn66epp3ztlw3z47hpyz6v2l7l3v4eqyj40utxhve3xuj42n3fxaz64ldnjzg07yw30f3ypuncx9ajsee6f34",
  konduitValidatorAddress: "addr1w8pc0agp7ce78zefuk38kyza8rnu3gzy9vy6ynhh7t9ygyglua36j",
  adaptors: [
    {
      label: "Ferret",
      url: "https://adaptor.ferret.channel",
    },
  ],
  connectors: [
    {
      label: "Ferret",
      url: "https://cardano.ferret.channel",
    },
  ],
};

export default preprod;
