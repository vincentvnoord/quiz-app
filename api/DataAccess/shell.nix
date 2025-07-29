{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs.dotnetCorePackages; [
    (combinePackages [
      sdk_9_0
      sdk_8_0
    ])
  ];

  shellHook = ''
    exec zsh
    export DOTNET_ROOT=${pkgs.dotnetCorePackages.sdk_9_0}/share/dotnet
    export PATH=$PATH:${pkgs.dotnetCorePackages.sdk_9_0}/bin
  '';
}
