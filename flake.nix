{
  description = "dev setup";

  outputs = { nixpkgs, ... }:
  let
    inherit (nixpkgs) lib;

    pkgs = nixpkgs.legacyPackages.x86_64-linux;
    npm = pkgs.nodePackages;
  in
  {
    devShells.x86_64-linux.default =
      pkgs.mkShell {
        packages = with npm; [
          pnpm
          vercel
        ];
      };
  };
}
