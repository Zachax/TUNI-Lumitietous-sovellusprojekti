Vagrant.configure("2") do |config|
  #Käteetään yksinkertaista virtuaalilaatikkoa
	config.vm.box = "ubuntu/bionic64"
  #Luetaan tarvittavat lisät seuraavasta tiedostosta
	config.vm.provision :shell, path: "bootstrap.sh"
  #Serverin portti
	config.vm.network :forwarded_port, guest: 3000, host: 3000
end